from time import time, strftime, localtime
from random import randint, randrange
import mysql.connector
import configparser
import sys

try:
    config_file = "../sm_db_config.ini"
    config_parse = configparser.ConfigParser()
    config_parse.read(config_file)
    config = {'user': config_parse['creds']['username'],
              'password': config_parse['creds']['password'],
              'host': config_parse['creds']['servername'],
              'database': config_parse['creds']['dbname']}

except KeyError:  # To operate mysql locally make sure you have it running.
    config = {'user': 'user1',
              'password': 'password',  # I suggest having no password on your local account
              'host': 'localhost',
              'database': 'sublet_matcher'}

today = int(time())
streets = ['St', 'Ave', 'Blvd', 'Boulevard', 'Avenue', 'Street', 'Ln', 'Lane']
names = ["Bill", "Bob", "Aelly", "Jack", "Aleena", "Elliot", "Alwardi", "James", "Hernandez", "Blain", "Sally",
         "Michelle", "John", "Georgina", "Julia", "Rocky", "Maxwell", "Anna", "May", "Richardson", "Blake", "Jane",
         "Ashley", "Wilcox", "Mike", "Jay", "Rich", "Ishaan", "Gomez", "Hannah"]
used_names = []


def random_date(start, is_start_date=False):
    return start + randrange(5000 if is_start_date else 12000000, 30000000)


def create_dates():
    start_date = random_date(today, is_start_date=True)
    end_date = random_date(start_date)

    return strftime('%m/%d/%y', localtime(start_date)), strftime('%m/%d/%y', localtime(end_date))


def fullname():
    first_name = names[randint(0, len(names) - 1)]
    last_name = names[randint(0, len(names) - 1)]
    times = 0

    while last_name == first_name or first_name + last_name in used_names:
        last_name = names[randint(0, len(names) - 1)]

        if times == 5:
            times = 0
            first_name = names[randint(0, len(names) - 1)]

    used_names.append(first_name + last_name)

    return first_name + ' ' + last_name


class Property:
    def __init__(self, owner):
        self.street = f"{randint(1000, 5999)} {randint(4, 20)}th {streets[randint(0, len(streets) - 1)]}"
        self.startDate, self.endDate = create_dates()
        self.unit = randint(0, 20)
        self.zipcode = randint(32601, 32612)
        self.owner = owner
        self.price = randint(10, 50) * 100
        self.available = randint(0, 1)
        self.numOfRoommates = randint(0, 4)

    def __str__(self):
        string_self = (f"Street: {self.street}\nUnit: {self.unit}\nZipcode: {self.zipcode}\nOwner: {self.owner}\n"
                       f"Duration: {self.startDate}-{self.endDate}\nPrice: ${self.price}\nisAvailable: {'Yes' if self.available else 'No'}"
                       f"\n{'Roommates: ' + str(self.numOfRoommates) if self.numOfRoommates != 0 else ''}")

        return string_self

    def sql_str(self):
        sql_st = (f"INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES (\'{self.street}\',\'{self.unit}\',\'{self.zipcode}\',\'{self.owner}\',"
                  f"STR_TO_DATE(\'{self.startDate}\', \'%m/%d/%y\'),STR_TO_DATE(\'{self.endDate}\', \'%m/%d/%y\'),{self.price},\'{self.available}\',{self.numOfRoommates});\n")

        return sql_st

class User:
    def __init__(self):
        self.name = fullname()
        self.passphrase = self.name.replace(" ", "").lower()
        self.email = self.passphrase + "@ufl.edu"
        self.phone = f"325{randint(100000, 999999)}"

    def __str__(self):
        string_self = f"Email: {self.email}\nPassphrase: {self.passphrase}\nName: {self.name}\nPhone: {self.phone}"

        return string_self

    def sql_str(self):
        sql_st = f"INSERT INTO User (email, passphrase, name, phone) VALUES (\'{self.email}\',sha1(\'{self.passphrase}\'),\'{self.name}\',\'{self.phone}\');\n"

        return sql_st

def make_data(n):
    users = []
    lease_sql_strs = []
    with open("SubletSQLDump.sql", 'w') as file:
        file.write('DROP TABLE IF EXISTS Property;\n')
        file.write('DROP TABLE IF EXISTS Bookmarks;\n')
        file.write('DROP TABLE IF EXISTS User;\n')
        file.write('CREATE TABLE Property (street VARCHAR(255), unit VARCHAR(127), zipcode VARCHAR(31), owner VARCHAR(127), startDate DATE, endDate DATE, price VARCHAR(31), available BOOL, numOfRoommates INT, PRIMARY KEY (street, unit, zipcode));\n')
        file.write('CREATE TABLE User (email VARCHAR(255) PRIMARY KEY, passphrase VARCHAR(511), phone VARCHAR(31), name VARCHAR(127));\n')
        file.write('CREATE TABLE Bookmarks (email VARCHAR(255), street VARCHAR(255), unit VARCHAR(127), zipcode VARCHAR(31), PRIMARY KEY (email, street, unit, zipcode));\n')
        for i in range(n):
            user = User()
            file.write(user.sql_str())
            users.append(user)

        for j in range(n // 4 * 3):
            rand_owner = users[randint(0, len(users) - 1)]
            prop = Property(rand_owner.name)
            file.write(prop.sql_str())

            if randint(1, 3) == 2:
                lease_sql_strs.append(f"INSERT INTO Bookmarks (email, street, unit , zipcode) VALUES (\'{rand_owner.email}\', \'{prop.street}\', \'{prop.unit}\', \'{prop.zipcode}\');\n")
        file.writelines(lease_sql_strs)


if __name__ == '__main__':
    if len(sys.argv) > 1:
        make_data(int(sys.argv[1]))
    else:
        make_data(50)

    conn = mysql.connector.connect(
        user=config['user'],
        password=config['password'],
        host=config['host'],
        database=config['database'])

    cursor = conn.cursor(buffered=True)
    for line in open("SubletSQLDump.sql"):
        result = cursor.execute(line[:-1])
    conn.commit()