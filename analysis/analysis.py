# %%
import pandas as pd
import numpy as np

# 默认存储路径为analysis/data/

import time as TM  # 记录时间
# time.time() #时间记录点 ,单位秒


def process():
    # traj records in the first day
    day1 = pd.read_csv('./data/day1.csv', decimal=',')
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

    # 保存的最终结果
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
                            arrs.append([x, y, _x, _y, 0, floor])
        # print(arrs.__len__())
        timeStart = int(3600*8)
        timeEnd = int(18*3600)
        time = timeStart
        while (time >= timeStart) & (time <= timeEnd):
            countPath = pd.DataFrame(arrs,
                                     columns=['x1', 'y1', 'x2', 'y2', 'count', 'floor'])
            nextTime = time+3600
            # 从按照id,时间和楼层组合中取出slice
            data = day1_sortBy_id_and_time[(day1_sortBy_id_and_time['time']
                                            <= nextTime) & (day1_sortBy_id_and_time['time'] >= time) & (day1_sortBy_id_and_time['floor'] == floor)]
            # 重建索引
            data.index = np.arange(data.__len__())
            # print(data)
            # for i in range(data.__len__()-1):
            #     if (data.loc[i, 'id'] == data.loc[i+1, 'id']) & (abs(data.loc[i, 'x']-data.loc[i+1, 'x'])) <= 1 & (abs(data.loc[i, 'y']-data.loc[i+1, 'y']) <= 1):
            #         idx = countPath[(countPath['x1'] == data.loc[i, 'x']) & (countPath['x2'] == data.loc[i+1, 'x']) & (
            #             countPath['y1'] == data.loc[i, 'y']) & (countPath['y2'] == data.loc[i+1, 'y'])]
            #         if idx.__len__() == 0:
            #             countPath = countPath.append(
            #                 {'x1': data.loc[i, 'y'], 'x2': data.loc[i+1, 'y'], 'y1': data.loc[i, 'x'], 'y2': data.loc[i+1, 'xs'], "count": 1, "time": time}, ignore_index=True)
            #         else:
            #             countPath.loc[idx.index, 'count'] += 1
            #     i += 1
            #     print(i)
            # print(countPath)
            for i in range(data.__len__()-1):
                if (data.at[i, 'id'] == data.at[i+1, 'id']) & (abs(data.at[i, 'x']-data.at[i+1, 'x']) <= 1) & (abs(data.at[i, 'y']-data.at[i+1, 'y']) <= 1):
                    idx = countPath[(countPath['x1'] == data.at[i, 'x']) & (countPath['x2'] == data.at[i+1, 'x']) & (
                        countPath['y1'] == data.at[i, 'y']) & (countPath['y2'] == data.at[i+1, 'y'])]
                    if idx.__len__() == 0:
                        m = {'x1': data.at[i, 'x'], 'x2': data.at[i+1, 'x'], 'y1': data.at[i,
                                                                                           'y'], 'y2': data.at[i+1, 'y'], "count": 1, "floor": floor}
                        print(m)
                    else:
                        index_v = idx.index.values[0]
                        countPath.at[index_v, 'count'] += 1
                i += 1
                # print(i)
            print(time)
            countPath.to_csv('./data/floor'+str(floor)+'/'+str(time)+'.csv',
                             index_label=False, index=False)
            time = nextTime

# 自定义源文件和存储路径


if __name__ == "__main__":
    process()
#    processCustom(filename,targetDir)
# %%
