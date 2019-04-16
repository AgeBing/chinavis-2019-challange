# %%
import pandas as pd
import numpy as np

# 默认存储路径为analysis/data/


def process():

    # traj records in the first day
    day1 = pd.read_csv('./data/day1.csv', decimal=',')
    old_columns = day1.columns
    # locations of sensors
    s_loaction = pd.read_csv('./data/传感器布置表.csv', delimiter=',')
    day1_x_y = pd.merge(day1, s_loaction, validate="many_to_one")
    day1_sortBy_id_and_time = day1_x_y .sort_values(
        by=["id", "time"], axis=0)

    timeStart = int(day1.at[0, 'time'])
    timeEnd = int(day1.tail(1)['time'])
    time = timeStart
    # 保存的最终结果

    while (time >= timeStart) & (time <= timeEnd):
        countPath = pd.DataFrame(
            columns=['x1', 'y1', 'x2', 'y2', 'count', 'time'])
        nextTime = time+3600
        # 从按照id和时间组合中取出slice
        data = day1_sortBy_id_and_time[(day1_sortBy_id_and_time['time']
                                        <= nextTime) & (day1_sortBy_id_and_time['time'] >= time)]
        # 重建索引
        data.index = np.arange(data.__len__())

        for i in range(data.__len__()-1):
            if (data.loc[i, 'id'] == data.loc[i+1, 'id']) & (abs(data.loc[i, 'x']-data.loc[i+1, 'x'])) <= 1 & (abs(data.loc[i, 'y']-data.loc[i+1, 'y']) <= 1):
                idx = countPath[(countPath['x1'] == data.loc[i, 'x']) & (countPath['x2'] == data.loc[i+1, 'x']) & (
                    countPath['y1'] == data.loc[i, 'y']) & (countPath['y2'] == data.loc[i+1, 'y'])]
                if idx.__len__() == 0:
                    countPath = countPath.append(
                        {'x1': data.loc[i, 'y'], 'x2': data.loc[i+1, 'y'], 'y1': data.loc[i, 'x'], 'y2': data.loc[i+1, 'xs'], "count": 1, "time": time}, ignore_index=True)
                else:
                    countPath.loc[idx.index, 'count'] += 1
            i += 1
            print(i)
        # print(countPath)
        print(nextTime)
        countPath.to_csv('./data/'+str(nextTime)+'.csv',
                         index_label=False, index=False)
        time = nextTime

# 自定义源文件和存储路径


def processCustom(filename, targetDir):
    day1 = pd.read_csv(filename, decimal=',')
    old_columns = day1.columns
    # locations of sensors
    s_loaction = pd.read_csv('./data/传感器布置表.csv', delimiter=',')
    day1_x_y = pd.merge(day1, s_loaction, validate="many_to_one")
    day1_sortBy_id_and_time = day1_x_y .sort_values(
        by=["id", "time"], axis=0)

    timeStart = int(day1.at[0, 'time'])
    timeEnd = int(day1.tail(1)['time'])
    time = timeStart
    # 保存的最终结果

    while (time >= timeStart) & (time <= timeEnd):
        countPath = pd.DataFrame(
            columns=['x1', 'y1', 'x2', 'y2', 'count', 'time'])
        nextTime = time+3600
        # 从按照id和时间组合中取出slice
        data = day1_sortBy_id_and_time[(day1_sortBy_id_and_time['time']
                                        <= nextTime) & (day1_sortBy_id_and_time['time'] >= time)]
        # 重建索引
        data.index = np.arange(data.__len__())

        for i in range(data.__len__()-1):
            if (data.loc[i, 'id'] == data.loc[i+1, 'id']) & (abs(data.loc[i, 'x']-data.loc[i+1, 'x'])) <= 1 & (abs(data.loc[i, 'y']-data.loc[i+1, 'y']) <= 1):
                idx = countPath[(countPath['x1'] == data.loc[i, 'x']) & (countPath['x2'] == data.loc[i+1, 'x']) & (
                    countPath['y1'] == data.loc[i, 'y']) & (countPath['y2'] == data.loc[i+1, 'y'])]
                if idx.__len__() == 0:
                    countPath = countPath.append(
                        {'x1': data.loc[i, 'y'], 'x2': data.loc[i+1, 'y'], 'y1': data.loc[i, 'x'], 'y2': data.loc[i+1, 'xs'], "count": 1, "time": time}, ignore_index=True)
                else:
                    countPath.loc[idx.index, 'count'] += 1
            i += 1
            print(i)
        # print(countPath)
        print(nextTime)
        countPath.to_csv(targetDir+str(nextTime)+'.csv',
                         index_label=False, index=False)
        time = nextTime


if __name__ == "__main__":
    process()
#    processCustom(filename,targetDir)
# %%
