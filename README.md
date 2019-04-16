## 0. analysis/

Python 脚本

## 1. frontend/

### 框架

React

```
create-react-app web
cd web/
npm start
```

## 2. server/

KOA

```
cd server
npm install
npm run server
```

## 3. Database

```
host     : '115.159.202.238',
user     : 'chinavis',
password : 'chinavis2019',
database : 'chinavis2019'
```

## 4. 数据预处理

> 通过运行`analysis`中的`analysis.py`文件可以将 data 文件夹中的`day1.csv`以一个小时为单位进行分割。分割的文件名表示的是秒数，包含该时间开始以后一个小时内的轨迹。
> 通过用`analysis.py`中的`processCustom(filename,targetDir)`方法可以自定义源文件和目标文件路径。
