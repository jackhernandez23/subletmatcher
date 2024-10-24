from random import randint, randrange
from time import time, strftime, localtime
import sys

today = int(time())
streets = ['St', 'Ave', 'Blvd', 'Boulevard', 'Avenue', 'Street', 'Ln', 'Lane']
names = ["Bill", "Bob", "Aelly", "Jack", "Aleena", "Elliot", "Alwardi", "James", "Hernandez", "Blain", "Sally",
         "Michelle", "John", "Georgina", "Julia", "Rocky", "Maxwell", "Anna", "May", "Richardson", "Blake"]
used_names = []


def random_date(start, is_start_date=False):
    return start + randrange(5000 if is_start_date else 12000000, 30000000)


def create_dates():
    start_date = random_date(today, is_start_date=True)
    end_date = random_date(start_date)

    return strftime('%m/%d/%y', localtime(start_date)), strftime('%m/%d/%y', localtime(end_date))


def fullname(used):
    first_name = names[randint(0, len(names) - 1)]
    last_name = names[randint(0, len(names) - 1)]
    times = 0

    while last_name == first_name or first_name + ' ' + last_name in used:
        last_name = names[randint(0, len(names) - 1)]

        if times == 5:
            times = 0
            first_name = names[randint(0, len(names) - 1)]

    used.append(first_name + ' ' + last_name)

    return first_name + ' ' + last_name


class Property:
    def __init__(self):
        self.street = f"{randint(1000, 5999)} {randint(4, 20)}th {streets[randint(0, len(streets) - 1)]}"
        self.startDate, self.endDate = create_dates()
        self.unit = randint(0, 20)
        self.zipcode = randint(32601, 32612)
        self.owner = fullname(used_names)
        self.price = randint(10, 50) * 100
        self.available = randint(0, 1)
        self.numOfRoommates = randint(0, 4)

    def __str__(self):
        string_self = (f"Street: {self.street}\nUnit: {self.unit}\nZipcode: {self.zipcode}\nOwner: {self.owner}\n"
                       f"Duration: {self.startDate}-{self.endDate}\nPrice: ${self.price}\nisAvailable: {'Yes' if self.available else 'No'}"
                       f"{'\nRoommates: ' + str(self.numOfRoommates) if self.numOfRoommates != 0 else ''}")

        return string_self

    def sql_str(self):
        sql_st = (f"INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES (\'{self.street}\',\'{self.unit}\',\'{self.zipcode}\',\'{self.owner}\',"
                  f"STR_TO_DATE(\'{self.startDate}\', \'%m/%d/%y\'),STR_TO_DATE(\'{self.endDate}\', \'%m/%d/%y\'),{self.price},\'{self.available}\',{self.numOfRoommates});\n")

        return sql_st


def make_property_date(n, filename="PropertyTableSQLDump.sql"):
    with open(filename, 'w') as file:
        file.write('DROP TABLE Property; \n\n')
        file.write('CREATE TABLE Property (\n')
        file.write('\tstreet VARCHAR(255),\n \tunit VARCHAR(127), \n \tzipcode VARCHAR(31), \n')
        file.write('\towner VARCHAR(127), \n \tstartDate DATE, \n \tendDate DATE, \n')
        file.write('\tprice VARCHAR(31), \n \tavailable BOOL, \n \tnumOfRoommates INT, \n')
        file.write('\tPRIMARY KEY (street, unit, zipcode) \n); \n\n\n')
        for i in range(n):
            listing = Property()
            file.write(listing.sql_str())



if __name__ == '__main__':
    make_property_date(int(sys.argv[1]))
