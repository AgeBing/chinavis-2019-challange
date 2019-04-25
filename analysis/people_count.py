import pandas as pd
import time as TM #记录时间


from  db  import insertOneRecordToCount 


start = TM.time()
files = [
    'data/day1.csv',
    'data/传感器布置表.csv'
]
df_day1_raw = pd.read_csv(files[0])
df_sensors  = pd.read_csv(files[1])


df_day1 =  pd.merge(df_day1_raw,df_sensors)


def time_to_hour(time):
    return  int(time/3600)
df_day1['hour']  =  df_day1['time'].apply(time_to_hour)


df_day1_floor1 = df_day1[df_day1['floor'] == 1]
df_day1_floor2 = df_day1[df_day1['floor'] == 2]

group_count = df_day1_floor1.groupby(['hour','sid'])['id'].count()
df_count =  pd.DataFrame({'count' : group_count }).reset_index()
df_count =  pd.merge(df_count,df_sensors)

end = TM.time()

print(end - start)


for row in df_count.itertuples():
	hour = row[1]
	x    = row[5]
	y    = row[6]
	count = row[3]
	insertOneRecordToCount(hour,x,y,count)

sql_end = TM.time()
print(sql_end - end)




