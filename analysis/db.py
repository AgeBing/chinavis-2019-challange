import pymysql.cursors


# Connect to the database
connection = pymysql.connect(host='',
                             user='',
                             port=3306,
                             password='',
                             db='chinavis2019',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


def insertOneRecordToCount(hour,x,y,count):
    with connection.cursor() as cursor:
            sql = "INSERT INTO  people_count_1 VALUES (%s, %s, %s, %s) " % \
                (hour,x,y,count)
            cursor.execute( sql )
            connection.commit()
    pass

def delAllRecordsInCount():
    with connection.cursor() as cursor:
            sql = "DELETE  FROM people_count_1 WHERE 1"
            cursor.execute( sql )
            connection.commit()
    print('delete done')
    pass
