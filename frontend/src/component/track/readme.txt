参数调整:
    参看 config.js

当前可选的数据范围：
    day 1 cluster 3、4
    day 2 cluster 3
    day 3 cluster 3

当前版本默认 直接删除 过道 0 /扶梯 21 22 23 24
    参看 server\src\model\track.js 的sql语句



远程拉数据库到本地：

cd C:\mytools\MySQL\mysql\bin
mysqldump --column-statistics=0  --host=115.159.202.238 -uchinavis -pchinavis2019 --databases chinavis2019 --tables  233 >  C:\Users\14403\Documents\dumps\a.sql

两张表联立查询，建立新表格：
CREATE TABLE track_day1_cluster3
SELECT traj.id AS id, traj.time2 AS time, traj.time AS clock, traj.rid AS place, cluster AS label
FROM trajectory_mergetime_day1 AS traj, cluster_by3 AS cluster
WHERE traj.id = cluster.id
limit 10;

本地数据传输给远程仓库：
批量查找替换所有的 utf8mb4_unicode_520_ci 为 utf8mb4_unicode_ci ，保存后上传即可。