import MySQLdb
import time
import Levenshtein
from sklearn.cluster import KMeans
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
def dataprocessing():
	conn = Connect_MYSQL()
	sql_select = "select *  from pre_traj_OrderByID_day1 LIMIT 1000"# id,sid,time,floor,x,y,rid
	cur = conn.cursor()
	cur.execute(sql_select)
	res = cur.fetchall()
	num = 0
	results={}
	before=""
	last_time=""#上次正好为分钟节点时的时间，可以被60整除
	last_location=[]#记录不足一分钟的地点及其所待的时间
    #与上一条记录的时间作对比，得到上段不移动的时间段长度
	sql_create='create table traj_splitByMinute_day1 (id char(5),time time,rid char(2))'
	cur.execute(sql_create)
	for row in res:
		# if before:
		# 	print(row[0],before[2],str(row[2]))
		if before=="":
			before=row
			#及时修正last_time
			cur_time = time.strptime(str(row[2]), '%H:%M:%S')
			last_time=time.strptime(str(cur_time.tm_hour)+":"+str(cur_time.tm_min)+":00","%H:%M:%S")
			last_location=[last_time,0]
			continue
		else:
			if row[0]!=before[0]:
				if last_time!="":
					#insert last_time记录原则，-----------------
					# print('start',{'id':before[0],'time':str(last_time.tm_hour)+":"+str(last_time.tm_min),'location':last_location[0]})
					sql_insert="insert into traj_splitByMinute_day1 values ('"+before[0]+"','"+str(last_time.tm_hour)+":"+str(last_time.tm_min)+":00','"+str(last_location[0])+"')"
					cur.execute(sql_insert)
					# print(sql_insert,'下一个id的轨迹了')
				before=row
				cur_time = time.strptime(str(row[2]), '%H:%M:%S')
				last_time=time.strptime(str(cur_time.tm_hour)+":"+str(cur_time.tm_min)+":00","%H:%M:%S")
				last_location=[last_time,0]
				continue
			else:
				cur_date=row[2]
				before_time = time.strptime(str(before[2]), '%H:%M:%S')#tm_hour,tm_min,tm_sec
				cur_time = time.strptime(str(row[2]), '%H:%M:%S')#tm_hour,tm_min,tm_sec
				# if before_time.tm_sec!=0:#起始时间不是一个整分钟数
				if cur_time.tm_hour==before_time.tm_hour and cur_time.tm_min==before_time.tm_min:#进入和离开的分钟标记相同，肯定小于一分钟
					#需要考虑last_time是不是跟before_time的分钟部分相同，不过现在没考虑，默认日志连续
					#上次与这次的时间差小于1分钟，所以取最长的地点作为该段时间的标识
					cha = cur_time.tm_sec-before_time.tm_sec
					if len(last_location)==0 or last_location[1]<cha:
						last_location=[before[6],cha]
					continue
				else:#进入和离开的分钟数不同
					cha = 60-before_time.tm_sec
					if last_location[1]<cha:
						last_location=[before[6],cha]
					sql_insert="insert into traj_splitByMinute_day1 values ('"+before[0]+"','"+str(last_time.tm_hour)+":"+str(last_time.tm_min)+":00','"+str(last_location[0])+"')"
					cur.execute(sql_insert)
					# print('start',sql_insert)
					
					#insert_sql="insert into hhhh (id:before[0],time:last_time,location:last_location[1])"
					#insert last_time记录，-----------------
					# if cur_time.tm_sec!=0:
					last_location=[row[6],cur_time.tm_sec]
					last_time=time.strptime(str(cur_time.tm_hour)+":"+str(cur_time.tm_min)+":00","%H:%M:%S")
					# print('start1',last_time)
					# else:
					# 	last_location=[]
					# 	last_time=""
				cha_minutes=(cur_time.tm_hour-before_time.tm_hour)*60 + cur_time.tm_min-before_time.tm_min-1
				for item in range(1,cha_minutes+1):
					#insert_sql="insert into hhhh (id:before[0],time:last_time,location:last_location[1])"
					minute=before_time.tm_min+item
					hour=before_time.tm_hour
					if(minute>=60):
						hour=hour+int(minute/60)
						minute=minute%60
					time.strptime(str(hour)+":"+str(minute)+":00","%H:%M:%S")
					sql_insert="insert into traj_splitByMinute_day1 values ('"+before[0]+"','"+str(hour)+":"+str(minute)+":00','"+str(row[6])+"')"
					cur.execute(sql_insert)
					# print('cycle',sql_insert)
				before=row
		    	#insert last_time记录，-----------------
	conn.commit()
	cur.close()


def Get_similarity(vec1,vec2):#id,vec,earliset,latest
	if vec1[0]==vec2[0]:
		return 0
	else:
		vec1_e= time.strptime(str(vec1[2]), '%H:%M:%S')
		vec1_l=time.strptime(str(vec1[3]), '%H:%M:%S')#(cur_time.tm_hour)+":"+str(cur_time.tm_min)+":00","%H:%M:%S")
		vec2_e= time.strptime(str(vec2[2]), '%H:%M:%S')
		vec2_l=time.strptime(str(vec2[3]), '%H:%M:%S')
		vec1_str=vec1[1]
		vec2_str=vec2[1]
		if vec1_e>vec2_e:
			earliset=vec2_e
			count=(vec1_e.tm_hour-vec2_e.tm_hour)*60+vec1_e.tm_min-vec2_e.tm_min
			for c in range(count):
				vec1_str='Z'+vec1_str
		else:
			earliset=vec1_e
			count=(vec2_e.tm_hour-vec1_e.tm_hour)*60+vec2_e.tm_min-vec1_e.tm_min
			for c in range(count):
				vec2_str='Z'+vec2_str
		if vec1_l>vec2_l:#1所包含的时间段长，2需要补齐
			latest=vec1_l
			count=(vec1_l.tm_hour-vec2_l.tm_hour)*60+vec1_l.tm_min-vec2_l.tm_min
			for c in range(count):
				vec2_str=vec2_str+'Z'
		else:#1要补齐
			latest=vec2_l
			count=(vec2_l.tm_hour-vec1_l.tm_hour)*60+vec2_l.tm_min-vec1_l.tm_min
			for c in range(count):
				vec1_str=vec1_str+'Z'
		return Levenshtein.distance(vec1_str, vec2_str)

def cluster(start_time,end_time,method='kmeans'):
	conn = Connect_MYSQL()
	sql_select="select * from traj_splitByMinute_day1 where time>='"+start_time+"'"+" and time <="+"'"+end_time+"' order by id,time"
	#id,time,rid
	cur = conn.cursor()
	cur.execute(sql_select)
	res = cur.fetchall()
	vecters=[]
	cur_vec=''
	before_id=''
	before_earliest_time=''
	before_latest_time=''
	for row in res:
		if before_id == '':
			before_id=row[0]
			cur_vec=cur_vec+('A'+row[2])
			before_earliest_time=row[1]
			before_latest_time=row[1]
		if before_id!=row[0]:
			vecters.append([str(before_id),cur_vec,str(before_earliest_time),str(before_latest_time)])
			cur_vec=chr(ord('A')+int(row[2]))
			before_id=row[0]
		else:
			cur_vec=cur_vec+chr(ord('A')+int(row[2]))
			before_latest_time=row[1]
	similarities=[]
	for i in range(len(vecters)):
		simi = []
		item=vecters[i]
		for j in range(i):
			simi.append(similarities[j][i])
		for s in range(i,len(vecters)):
			simi.append(Get_similarity(vecters[i],vecters[s]))
		similarities.append(simi)
	# print('similarities',similarities)
	cluster_model = KMeans(n_clusters=3)#构造聚类器
	cluster_model.fit(similarities)#聚类
	label_pred = cluster_model.labels_ #获取聚类标签
	centroids = cluster_model.cluster_centers_ #获取聚类中心
	inertia = cluster_model.inertia_ # 获取聚类准则的总和
	results={}
	for i in range(len(label_pred)):
		results[vecters[i][0]]=label_pred[i]
	print(results)

		
# cluster('12:12:00','15:21:00')
