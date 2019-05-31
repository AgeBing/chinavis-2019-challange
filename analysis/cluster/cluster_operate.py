#mergetimeroom:厕所合并为厕所1的id，room合并为room1的id，扶梯合并为21,23
import MySQLdb
import time
import datetime
from cluster_dataprocess import Connect_MYSQL
def merge_room(merge_rooms,in_table,out_table,table_num):
	conn = Connect_MYSQL()
	sql_select = "select * from "+in_table+str(table_num)#+" LIMIT 1000"# id,time,floor,rid
	cur = conn.cursor()
	cur.execute(sql_select)
	res = cur.fetchall()
	before=""
	# sql_create='create table '+out_table+str(table_num)+' (id char(5),time time,floor char(1),rid char(2))'
	# cur.execute(sql_create)
	# conn.commit()
	count=0
	delete=[]#
	for row in res:
		if count%1000==0:
			conn.commit()
			count=0
		if int(row[3]) in merge_rooms:
			before=row
			continue
		else:#该记录不是经过扶梯过道一类的
			if before[0]!=row[0]:
				before=""
			if before!="":#同一个id，同一个人的轨迹
				
				# sql_insert="insert into "+out_table+str(table_num)+" values ('"+row[0]+"','"+str(before[1])+"','"+str(row[2])+"','"+str(row[3])+"')"
				cur.execute(sql_insert)
				count=count+1
			else:
				sql_insert="insert into "+out_table+str(table_num)+" values ('"+row[0]+"','"+str(row[1])+"','"+str(row[2])+"','"+str(row[3])+"')"
				cur.execute(sql_insert)
				count=count+1
	conn.commit()
	cur.close()

def get_len():
	conn = Connect_MYSQL()
	sql_select = "select * from traj_MergeTimeRoom_day1"#+" LIMIT 1000"# id,time,floor,rid
	cur = conn.cursor()
	cur.execute(sql_select)
	res = cur.fetchall()
	before=""
	count=0
	cha=0
	for row in res:
		if row[3]=='0':
			before=row
			continue
		else:#当前记录rid不为0
			if before!='' and row[0]==before[0]:#同一个人的轨迹
				if row[3]!='0':
					row_time=datetime.datetime.strptime(str(row[1]),"%H:%M:%S")
					before_time=datetime.datetime.strptime(str(before[1]),"%H:%M:%S")
					cha+=(row_time-before_time).seconds
					count+=1
					# print(row_time-before_time)
					before=''
			else:
				before=''
	print(cha/count)

def merge_next(in_name,out_name,day,threshold):#将阈值threshold内的'0'合并到下一个rid时长中
	conn = Connect_MYSQL()
	sql_select = "select * from "+in_name+str(day)#traj_MergeTimeRoom_day1"#+" LIMIT 1000"# id,time,floor,rid
	cur = conn.cursor()
	cur.execute(sql_select)
	res = cur.fetchall()
	sql_create='create table '+out_name+str(day)+' (id char(5),time time,floor char(1),rid char(2))'
	cur.execute(sql_create)
	conn.commit()
	before=""
	count=0
	cha=0
	for row in res:
		if count%10000==0:
			conn.commit()
			count=0
		if before=='':#不存在未插入的rid=0的记录
			if row[3]=='0':
				before=row
			else:#当前记录rid不为0
				sql_insert="insert into {0} values('{1}','{2}','{3}','{4}')".format(out_name+str(day),row[0],row[1],row[2],row[3])
				# print('1',sql_insert)
				cur.execute(sql_insert)
				count=count+1
		else:#未插入的rid=0的记录存在
			if row[0]==before[0]:#同一个人的轨迹
				if row[3]!='0':#当前记录rid 不为0
					row_time=datetime.datetime.strptime(str(row[1]),"%H:%M:%S")
					before_time=datetime.datetime.strptime(str(before[1]),"%H:%M:%S")
					cur_cha=(row_time-before_time).seconds
					if cur_cha<threshold:
						sql_insert="insert into {0} values('{1}','{2}','{3}','{4}')".format(out_name+str(day),row[0],before[1],row[2],row[3])
						cur.execute(sql_insert)
						# print('2',sql_insert)
						count=count+1
					else:
						sql_insert="insert into {0} values('{1}','{2}','{3}','{4}')".format(out_name+str(day),before[0],before[1],before[2],before[3])
						# print('3',sql_insert)
						cur.execute(sql_insert)
						sql_insert="insert into {0} values('{1}','{2}','{3}','{4}')".format(out_name+str(day),row[0],row[1],row[2],row[3])
						# print('4',sql_insert)
						cur.execute(sql_insert)
						count=count+2
					before=''
				else:#同一个人，当前rid=0
					row_time=datetime.datetime.strptime(str(row[1]),"%H:%M:%S")
					before_time=datetime.datetime.strptime(str(before[1]),"%H:%M:%S")
					cur_cha=(row_time-before_time).seconds
					if cur_cha>threshold:#多次经过rid=0，若时间差大于阈值则保存rid=0的记录
						sql_insert="insert into {0} values('{1}','{2}','{3}','{4}')".format(out_name+str(day),before[0],before[1],before[2],before[3])
						cur.execute(sql_insert)
						# print('2',sql_insert)
						count=count+1

			else:#换人的轨迹了，before插入数据库，重新获取before信息
				sql_insert="insert into {0} values('{1}','{2}','{3}','{4}')".format(out_name+str(day),before[0],before[1],before[2],before[3])
				cur.execute(sql_insert)
				if row[3]=='0':
					before=row
				else:
					sql_insert="insert into {0} values('{1}','{2}','{3}','{4}')".format(out_name+str(day),row[0],row[1],row[2],row[3])
					# print('5',sql_insert)
					cur.execute(sql_insert)
					count=count+1
					before=""
	conn.commit()
	cur.close()
'''
if before=='':#之前没有rid=0，未插入的记录
	rid=0:#rid=0，存起来
		before=row
	else:#不是rid=0
		insert row[time],row[rid]
else:#存在rid=0未插入的记录
	if row[id]==before[id]:
		if row[rid]!=0:#当前记录rid不为0 
			if len<threshold:
				insert before[time],row[rid]
			else:
				insert row
'''
def clone_DB():
	conn = Connect_MYSQL()
	sql='mysqldump --column-statistics=0  --host=115.159.202.238 -uchinavis -pchinavis2019 --databases chinavis2019  --tables   traj_MergeTime_day1 traj_MergeTime_day2 traj_MergeTime_day3>traj_MergeTime_day.sql'
	cur = conn.cursor()
	cur.execute(sql)
	res = cur.fetchall()
	conn.commit()
	cur.close()
def Get_row_len(in_table):#'in_table:traj_MergeTime_day'
	conn = Connect_MYSQL()
	sql_select = "select *  from "+in_table+str(day)#+" LIMIT 100"# id,time,floor,rid,time2
	cur = conn.cursor()
	cur.execute(sql_select)
	res = cur.fetchall()
	num = 0
	results={}
	before=""
	for row in res:
		if before=="":
			before=row
			continue
		else:
			if before[0]==row[0]:
				
# clone_DB()
# get_len()
# for day in range(1,4):
# 	merge_next('traj_MergeTimeRoom_day','traj_MergeRoom0_day',day,160)