import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser


DB = 'reminder.sqlite'


def get_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'task': row[1],
        'timeText': row[2],
        'dateText': row[3],

    }

    return row_dict


app = Flask(__name__)


@app.route('/api/taskReminder', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM taskReminder ORDER BY dateText')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/taskReminder/<int:taskReminder>', methods=['GET'])
def show(taskReminder):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM taskReminder WHERE id=?', (str(taskReminder),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/taskReminder', methods=['POST'])
def store():
    if not request.json:
        abort(404)

    new_taskReminder = (
        request.json['task'],
        request.json['timeText'],
        request.json['dateText'],

    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO taskReminder(task,timeText,dateText)
        VALUES(?,?,?)
    ''', new_taskReminder)

    taskReminder_id = cursor.lastrowid

    db.commit()

    response = {
        'id': taskReminder_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/taskReminder/<int:taskReminder>', methods=['PUT'])
def update(taskReminder):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != taskReminder:
        abort(400)

    update_taskReminder = (
        request.json['task'],
        request.json['timeText'],
        request.json['dateText'],
        str(taskReminder),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE taskReminder SET
            task=?,timeText=?,dateText=?
        WHERE id=?
    ''', update_taskReminder)

    db.commit()

    response = {
        'id': taskReminder,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/taskReminder/<string:taskReminder>', methods=['GET'])
def showDate(taskReminder):

    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM taskReminder WHERE dateText=? ORDER BY timeText', ((taskReminder),))
    rows = cursor.fetchall()
    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/taskReminder/<int:taskReminder>', methods=['DELETE'])
def delete(taskReminder):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != taskReminder:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM taskReminder WHERE id=?', (str(taskReminder),))

    db.commit()

    response = {
        'id': taskReminder,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='127.0.0.1', port=port)
