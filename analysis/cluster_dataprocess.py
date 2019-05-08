import MySQLdb
import time
import Levenshtein
from sklearn.cluster import KMeans
import csv
import json
def Connect_MYSQL():
    conn = MySQLdb.connect(
        host='115.159.202.238',
        user='chinavis',
        port=3306,
        password='chinavis2019',
        db='chinavis2019',
        charset='utf8mb4',
        # cursorclass=pymysql.cursors.DictCursor
    )
    return conn
def merge_time(day):
	conn = Connect_MYSQL()
	sql_select = "select * from pre_traj_OrderByID_day"+str(day)#+" LIMIT 1000"# id,sid,time,floor,x,y,rid
	cur = conn.cursor()
	cur.execute(sql_select)
	res = cur.fetchall()
	before=""
	sql_create='create table traj_MergeTime_day'+str(day)+' (id char(5),time time,floor char(1),rid char(2))'
	cur.execute(sql_create)
	conn.commit()
	count=0
	row_count=0
	Is_start=0#0表示上一条记录没插入数据库
	for row in res:
		if count%1000==0:
			conn.commit()
			count=0
		if before=="":
			before=row
			Is_start=1
			sql_insert="insert into traj_MergeTime_day"+str(day)+" values ('"+before[0]+"','"+str(before[2])+"','"+str(before[3])+"','"+str(before[6])+"')"
			cur.execute(sql_insert)
			count=count+1
		else:
			if before[0]==row[0]:#没换人
				if before[6]==row[6]:#floor完全不用管它,
					before=row
					Is_start=0
				else:#没换人，换地方了
					before=row
					sql_insert="insert into traj_MergeTime_day"+str(day)+" values ('"+before[0]+"','"+str(before[2])+"','"+str(before[3])+"','"+str(before[6])+"')"
					cur.execute(sql_insert)
					count=count+1
					Is_start=1
					
			else:#换人了
				if Is_start==0:#上一条记录没插入数据库
					sql_insert="insert into traj_MergeTime_day"+str(day)+" values ('"+before[0]+"','"+str(before[2])+"','"+str(before[3])+"','"+str(before[6])+"')"
					cur.execute(sql_insert)
				before=row
				sql_insert="insert into traj_MergeTime_day"+str(day)+" values ('"+before[0]+"','"+str(before[2])+"','"+str(before[3])+"','"+str(before[6])+"')"
				cur.execute(sql_insert)
				count=count+1
				Is_start=1
	conn.commit()
	cur.close()

def dataprocessing_len(day):#1,2,3
	conn = Connect_MYSQL()
	sql_select = "select *  from traj_MergeTime_day"+str(day)#+" LIMIT 100"# id,time,floor,rid
	cur = conn.cursor()
	cur.execute(sql_select)
	res = cur.fetchall()
	num = 0
	results={}
	before=""
	last_time=""#上次正好为分钟节点时的时间，可以被60整除
	last_location=[]#记录不足一分钟的地点及其所待的时间
    #与上一条记录的时间作对比，得到上段不移动的时间段长度
	sql_create='create table traj_splitByMinutes_day'+str(day)+' (id char(5),time time,rid char(2),len int)'
	cur.execute(sql_create)
	conn.commit()
	count=0
	row_count=0
	for row in res:
		row_count=row_count+1
		if row_count%1000==0:
			conn.commit()
			print(row_count)
		if before=="":
			before=row
			#及时修正last_time
			cur_time = time.strptime(str(row[1]), '%H:%M:%S')
			last_time=time.strptime(str(cur_time.tm_hour)+":"+str(cur_time.tm_min)+":00","%H:%M:%S")
			last_location=[before[3],0]
			continue
		else:
			if row[0]!=before[0]:
				if last_time!="":
					sql_insert="insert into traj_splitByMinutes_day"+str(day)+" values ('"+before[0]+"','"+str(last_time.tm_hour)+":"+str(last_time.tm_min)+":00','"+str(last_location[0])+"',1)"
					cur.execute(sql_insert)
					count=count+1
					if count%1000==0:
						conn.commit()
						count=0
				before=row
				cur_time = time.strptime(str(row[1]), '%H:%M:%S')
				last_time=time.strptime(str(cur_time.tm_hour)+":"+str(cur_time.tm_min)+":00","%H:%M:%S")
				last_location=[before[3],0]
				continue
			else:
				# cur_date=row[1]
				before_time = time.strptime(str(before[1]), '%H:%M:%S')#tm_hour,tm_min,tm_sec
				cur_time = time.strptime(str(row[1]), '%H:%M:%S')#tm_hour,tm_min,tm_sec
				# if before_time.tm_sec!=0:#起始时间不是一个整分钟数
				if cur_time.tm_hour==before_time.tm_hour and cur_time.tm_min==before_time.tm_min:#进入和离开的分钟标记相同，肯定小于一分钟
					#需要考虑last_time是不是跟before_time的分钟部分相同，不过现在没考虑，默认日志连续
					#上次与这次的时间差小于1分钟，所以取最长的地点作为该段时间的标识
					cha = cur_time.tm_sec-before_time.tm_sec
					if len(last_location)==0 or last_location[1]<cha:
						last_location=[before[3],cha]
					before=row
					continue
				else:#进入和离开的分钟数不同
					cha = 60-before_time.tm_sec
					# print(before,row,cha,last_location[1])
					if last_location[1]<cha:
						last_location=[before[3],cha]
					# print(last_time,last_location)
					sql_insert="insert into traj_splitByMinutes_day"+str(day)+" values ('"+before[0]+"','"+str(last_time.tm_hour)+":"+str(last_time.tm_min)+":00','"+str(last_location[0])+"',1)"
					cur.execute(sql_insert)
					count=count+1
					if count%1000==0:
						conn.commit()
						count=0
					last_location=[before[3],cur_time.tm_sec]
					last_time=time.strptime(str(cur_time.tm_hour)+":"+str(cur_time.tm_min)+":00","%H:%M:%S")
				cha_minutes=(cur_time.tm_hour-before_time.tm_hour)*60 + cur_time.tm_min-before_time.tm_min-1
				start_minute=before_time.tm_min+1
				start_hour=before_time.tm_hour
				if(start_minute>=60):
					start_hour=start_hour+int(start_minute/60)
					start_minute=start_minute%60
				time.strptime(str(start_hour)+":"+str(start_minute)+":00","%H:%M:%S")
				if cha_minutes>0:
					sql_insert="insert into traj_splitByMinutes_day"+str(day)+" values ('"+before[0]+"','"+str(start_hour)+":"+str(start_minute)+":00','"+str(before[3])+"',"+str(cha_minutes)+")"
					cur.execute(sql_insert)
					count=count+1
					if count%1000==0:
						conn.commit()
						count=0
				before=row
		    	#insert last_time记录，-----------------
	conn.commit()
	cur.close()


def Get_similarity(id1,id2,vectors1,vectors2):#vec,earliset,latest
	if id1==id2:
		return 0
	else:
		vec1_strs=""
		vec2_strs=""
		distance=0
		for i in range(len(vectors1)):
			len_1=len(vectors1[i])
			len_2=len(vectors2[i])
			vec1=vectors1[i]
			vec2=vectors2[i]
			if len_1==0 and len_2==0:
				continue
			if len_1!=0 and len_2==0:
				distance=distance+len(vec1[0])
				continue
				# vec2=['',vec1[1],vec1[1]]
			if len_1==0 and len_2!=0:
				distance=distance+len(vec2[0])
				continue
				# vec1=['',vec2[1],vec2[1]]
			vec1_e= time.strptime(str(vec1[1]), '%H:%M:%S')
			vec1_l=time.strptime(str(vec1[2]), '%H:%M:%S')#(cur_time.tm_hour)+":"+str(cur_time.tm_min)+":00","%H:%M:%S")
			vec2_e= time.strptime(str(vec2[1]), '%H:%M:%S')
			vec2_l=time.strptime(str(vec2[2]), '%H:%M:%S')
			vec1_str=vec1[0]
			vec2_str=vec2[0]
			# print('before',len(vec1_str),distance,len(vec2_str),str(vec1[1]),str(vec2[1]))
			if vec1_e>vec2_e:
				earliset=vec2_e
				count=(vec1_e.tm_hour-vec2_e.tm_hour)*60+vec1_e.tm_min-vec2_e.tm_min
				distance=distance+count
				vec2_str=vec2_str[count:]
			else:
				earliset=vec1_e
				count=(vec2_e.tm_hour-vec1_e.tm_hour)*60+vec2_e.tm_min-vec1_e.tm_min
				distance=distance+count
				vec1_str=vec1_str[count:]
			# print('before-after',len(vec1_str),distance,len(vec2_str),str(vec1[2]),str(vec2[2]))
			if vec1_l>vec2_l:#1的终止时间晚，1需要删除
				latest=vec1_l
				count=(vec1_l.tm_hour-vec2_l.tm_hour)*60+vec1_l.tm_min-vec2_l.tm_min
				distance=distance+count
				vec1_str=vec1_str[:len(vec1_str)-count]
			else:#1要补齐
				latest=vec2_l
				count=(vec2_l.tm_hour-vec1_l.tm_hour)*60+vec2_l.tm_min-vec1_l.tm_min
				distance=distance+count
				vec2_str=vec2_str[:len(vec2_str)-count]
			if vec1_str!="" and vec2_str!="":
				# print('after',len(vec1_str),distance,len(vec2_str))
				for i in range(len(vec1_str)):
					if vec1_str[i]!=vec2_str:
						distance=distance+1
				# distance=distance+Levenshtein.distance(vec1_str, vec2_str)
		return distance
def save_data(days):
	conn = Connect_MYSQL()
	for day in days:#range(1,len(days)+1):
		sql_select="select * from traj_splitByMinutes_day"+str(day)#+"  order by id,time limit 1000"#where time>='"+start_time+"'"+" and time <="+"'"+end_time+"'6
		#id,time,rid,len
		cur = conn.cursor()
		cur.execute(sql_select)
		res = cur.fetchall()
		with open("traj_splitByMinutes_day"+str(day)+".csv","w") as csvfile: 
		    writer = csv.writer(csvfile)
		    #先写入columns_name
		    writer.writerow(["id","time","rid",'len'])
		    #写入多行用writerows
		    writer.writerows(res)

def Get_vectors():
	vectors={}
	vectors_order=[]
	for day in range (1,4):
		vectors[day]={}
		csvFile = open("traj_splitByMinutes_day"+str(day)+".csv", "r")
		reader = csv.reader(csvFile)
		cur_vec=''
		before_id=''
		before_earliest_time=''
		before_latest_time=''
		for row in reader:
		    # 忽略第一行
			if reader.line_num == 1 or len(row)==0:
			    continue
			row[3]=int(row[3])
			if str(row[0]) not in vectors_order:
				vectors_order.append(str(row[0]))
			if before_id == '':
				before_id=row[0]
				for i in range(row[3]):
					cur_vec=cur_vec+chr(ord('A')+int(row[2]))
				before_earliest_time=row[1]
				before_latest_time=row[1]
			if before_id!=row[0]:
				vectors[day][str(before_id)]=[cur_vec,str(before_earliest_time),str(before_latest_time)]
				cur_vec=""
				for i in range(row[3]):
					cur_vec=cur_vec+chr(ord('A')+int(row[2]))
				before_earliest_time=row[1]
				before_id=row[0]
			else:
				for i in range(row[3]):
					cur_vec=cur_vec+chr(ord('A')+int(row[2]))
				before_latest_time=row[1]
		csvFile.close()
		with open("vectors_order.csv","w") as csvfile: 
		    writer = csv.writer(csvfile)
		    #写入多行用writerows
		    writer.writerows(vectors_order)
		jsObj = json.dumps(vectors)
		fileObject = open('vectors.json', 'w')
		fileObject.write(jsObj)
def Get_sim():
	vectors_order=[]
	csvFile = open("vectors_order.csv", "r")
	reader = csv.reader(csvFile)
	for row in reader:
	    # 忽略第一行
		if len(row)==0:
		    continue
		vectors_order.append("".join(row))	
	with open("vectors.json",'r') as load_f:
		vectors = json.load(load_f)
	with open("similarities.csv","w") as csvfile: 
		writer = csv.writer(csvfile)
		writer.writerow(vectors_order)#写入多行用writerows
	similarities=[]
	for i in range(len(vectors_order)):
		if i%500==0:
			with open("similarities.csv","a") as csvfile: 
			    writer = csv.writer(csvfile)
			    #写入多行用writerows
			    writer.writerows(similarities)
			print(i)
			similarities=[]
		simi = []
		item=vectors_order[i]#用户ID
		# for j in range(i):
		# 	simi.append(similarities[j][i])
		vec_i=[]
		for day in range(1,4):
				if vectors[str(day)].__contains__(vectors_order[i]):
					vec_i.append(vectors[str(day)][vectors_order[i]])
				else:
					vec_i.append([])
		for s in range(i+1,len(vectors_order)):
			vec_s=[]
			for day in range(1,4):
				if vectors[str(day)].__contains__(vectors_order[s]):
					vec_s.append(vectors[str(day)][vectors_order[s]])
				else:
					vec_s.append([])
			simi.append(Get_similarity(vectors_order[i],vectors_order[s],vec_i,vec_s))
		similarities.append(simi)
	if len(similarities)!=0:
		with open("similarities.csv","a") as csvfile: 
		    writer = csv.writer(csvfile)
		    #写入多行用writerows
		    writer.writerows(similarities)
def cluster_days_ByCSV(n_clusters,method='kmeans'):
	# Get_sim()
	# print('similarities',similarities)
	csvFile = open("similarities.csv", "r")
	initial_similarities = csv.reader(csvFile)
	similarities=[]
	index=0
	vectors_order=[]
	for sim in initial_similarities:
		if initial_similarities.line_num==1 :
			vectors_order=vectors_order+sim
			continue
		if len(sim)==0:
			continue
		similar=[]
		for i in range(0,index):
			similar.append(similarities[i][index])
		similar.append(0)
		similar=similar+sim
		index=index+1
		similarities.append(similar)
	print(len(similarities),len(vectors_order))
	last_sim=[]
	for i in range(len(vectors_order)-1):
		last_sim.append(similarities[i][len(vectors_order)-1])
	last_sim.append(0)
	similarities.append(last_sim)
	cluster_model = KMeans(n_clusters=n_clusters)#构造聚类器
	cluster_model.fit(similarities)#聚类
	label_pred = cluster_model.labels_ #获取聚类标签
	centroids = cluster_model.cluster_centers_ #获取聚类中心
	inertia = cluster_model.inertia_ # 获取聚类准则的总和
	print('cluster over')
	conn = Connect_MYSQL()
	sql_create='create table cluster_By'+str(n_clusters)+' (id char(5),cluster char(2))'
	cur = conn.cursor()
	cur.execute(sql_create)
	conn.commit()
	with open("cluster_result"+str(n_clusters)+".csv","w") as csvfile: 
		writer = csv.writer(csvfile)
		writer.writerows([vectors_order,label_pred])#写入多行用writerows
	print('write over')
	count=0
	for i in range(len(label_pred)):
		sql_insert="insert into cluster_By"+str(n_clusters)+" values ('"+vectors_order[i]+"','"+str(label_pred[i])+"')"
		cur.execute(sql_insert)
		count=count+1
		if count>1000:
			print(count)
			conn.commit()
			count=0
	conn.commit()
	cur.close()
# dataprocessing_len(3)
# merge_time(1)
# results=cluster_days(6)
# save_data([1,2,3])
# Get_vectors()
# Get_sim()
cluster_days_ByCSV(4)
