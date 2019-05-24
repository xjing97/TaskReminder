
import sqlite3
db = sqlite3.connect('reminder.sqlite')

db.execute('DROP TABLE IF EXISTS taskReminder')

db.execute('''CREATE TABLE taskReminder(
     id integer PRIMARY KEY,
    task text NOT NULL,
    timeText text NOT NULL,
    dateText text NOT NULL
)''')

cursor = db.cursor()

cursor.execute('''
    INSERT INTO taskReminder(task,timeText,dateText)
    VALUES('cooking','1200','2018-01-28')
''')


db.commit()
db.close()
