import os
import re
import pandas as pd
import pymysql.cursors
import time as TM  # 记录时间

# Connect to the database
connection = pymysql.connect(host='',
                             user='',
                             port=3306,
                             password='',
                             db='chinavis2019',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

# 将秒转化为 时:分:秒


def s2h(seconds):
    h = int(seconds / 3600)
    m = int((seconds - 3600*h) / 60)
    s = seconds - 3600*h + 60*m

    return {
        'h': h,
        'm': m,
        's': s
    }


# 文件名需要为   seconds.csv !!!!

# 读取导出的文件名 csv
def readFileDir():
    files = os.listdir(r'./data/')
    # print(files)

    transFlag = 0
    for file in files:
        res = re.match('\\d+', file)
        if res:
            # print( res.group() )
            seconds = res.group()
            time = s2h(int(seconds))
            file2Database(file, time['h'])

            print(file, ' in ', str(time['h']), 'hour, transform done!')
            print('*' * 10)
            transFlag = 1
    if not transFlag:
        print('no available files!')
    pass


def file2Database(fileName, hour):

    start = TM.time()

    df = pd.read_csv('./data/'+fileName, decimal=',')
    df = df[df['count'] != 0]
    print('len: ', str(len(df)))

    for row in df.itertuples():
        x1 = row[1]
        y1 = row[2]
        x2 = row[3]
        y2 = row[4]
        count = row[5]
        # print(x1,y1,x2,y2,count)
        insertOneRecord(x1, y1, x2, y2, count, hour)
    end = TM.time()
    use = end - start
    print('use ', str(use), ' s')


def insertOneRecord(id, x1, y1, x2, y2, floor):
    with connection.cursor() as cursor:
        sql = "INSERT INTO  base_trajectory VALUES (%s, %s, %s, %s, %s, %s) " % \
            (id, x1, y1, x2, y2, floor)
        cursor.execute(sql)
        connection.commit()
    pass


# 删除所有记录
def delAllRecords():
    with connection.cursor() as cursor:
        sql = "DELETE  FROM traj_sort_by_onehour WHERE 1"
        cursor.execute(sql)
        connection.commit()
    print('delete done')
    pass


# delAllRecords()
readFileDir()
