import os
import re
import pandas as pd
import pymysql.cursors
import time as TM  # 记录时间
import numpy as np

# 用这种方法处理有一个问题，就是如果有一个人从出口进的话，就会被在数据预处理的时候被“清洗掉”
# Connect to the database
connection = pymysql.connect(host='115.159.202.238',
                             user='chinavis',
                             port=3306,
                             password='chinavis2019',
                             db='chinavis2019',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


def insertOneRecord(id, x1, y1, x2, y2, time1, time2, floor1, floor2):
    with connection.cursor() as cursor:
        sql = "INSERT INTO  base_trajectory_day3 VALUES (%s, %s, %s, %s, %s, %s,%s,%s,%s) " % \
            (id, x1, y1, x2, y2, time1, time2, floor1, floor2)
        cursor.execute(sql)
        connection.commit()
    pass


def delAllRecords():
    with connection.cursor() as cursor:
        sql = "DELETE  FROM base_trajectory WHERE 1"
        cursor.execute(sql)
        connection.commit()
    print('delete done')
    pass


def getBaseT():
    # day1 = pd.read_csv('./data/day1.csv', decimal=',')
    # old_columns = day1.columns
    # locations of sensors
    s_loaction = pd.read_csv('./data/传感器布置表.csv', delimiter=',')
    X_NUM = s_loaction.x.max() + 1
    Y_NUM = s_loaction.y.max() + 1

    X = X_NUM
    Y = Y_NUM
    id = 0
    for floor in [1, 2]:
        arrs = []
        for x in range(0, X):
            for y in range(0, Y):
                xs = []
                ys = []
                if (x-1) >= 0:
                    xs.append(x-1)
                xs.append(x)
                if (x+1) <= X:
                    xs.append(x+1)
                if (y-1) >= 0:
                    ys.append(y-1)
                ys.append(y)
                if (y+1) <= Y:
                    ys.append(y+1)

                for _x in xs:
                    for _y in ys:
                        if ((x != _x) | (y != _y)):
                            arrs.append([id, x, y, _x, _y, floor])
                            id += 1
        df = pd.DataFrame(arrs,
                          columns=['id', 'x1', 'y1', 'x2', 'y2',  'floor'])
        for row in df.itertuples():
            id = row[1]
            x1 = row[2]
            y1 = row[3]
            x2 = row[4]
            y2 = row[5]
            floor = row[6]
            # print(x1,y1,x2,y2,count)
            # insertOneRecord(id, x1, y1, x2, y2, floor)


def process():
    day1 = pd.read_csv('./data/day3.csv', decimal=',')
    # old_columns = day1.columns
    # locations of sensors
    s_loaction = pd.read_csv('./data/传感器布置表.csv', delimiter=',')
    X_NUM = s_loaction.x.max() + 1
    Y_NUM = s_loaction.y.max() + 1

    X = X_NUM
    Y = Y_NUM

    day1_x_y = pd.merge(day1, s_loaction, validate="many_to_one")
    # 根据id和time来对数据进行排序
    day1_sortBy_id_and_time = day1_x_y .sort_values(
        by=["id", "time"], axis=0)
    exit = [[5, 15], [15, 15], [17, 15]]
    day1_sortBy_id_and_time.index = np.arange(
        day1_sortBy_id_and_time.__len__())
    # print(day1_sortBy_id_and_time)
    # 保存的最终结果

    start = {}
    arr = []
    for row in day1_sortBy_id_and_time.itertuples():
        if row.id >= 0:
            if start == {}:
                pass
            # elif start.id == row.id and not ([start.x, start.y] in exit):
            elif start.id == row.id:
                # next=row
                insertOneRecord(start.id, start.x, start.y, row.x,
                                row.y, start.time, row.time, start.floor, row.floor)
            start = row
    print(arr[0:10])


if __name__ == "__main__":
    process()
