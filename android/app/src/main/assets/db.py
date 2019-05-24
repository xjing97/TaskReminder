import sqlite3
db = sqlite3.connect('db.sqlite')



db.execute('''CREATE TABLE reminder(
    id integer PRIMARY KEY,
    task text NOT NULL,
    timeText text NOT NULL,
    dateText text NOT NULL
)''')

cursor = db.cursor()
cursor.execute('''INSERT INTO reminder(task,timeText,dateText) VALUES("cooking","0200","2018-01-28")''')



db.commit()
db.close()
