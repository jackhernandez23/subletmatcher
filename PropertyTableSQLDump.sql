DROP TABLE Property;
CREATE TABLE Property (street VARCHAR(255), unit VARCHAR(127), zipcode VARCHAR(31), owner VARCHAR(127), startDate DATE, endDate DATE, price VARCHAR(31), available BOOL, numOfRoommates INT, PRIMARY KEY (street, unit, zipcode));
INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES ('5945 9th Lane','8','32612','May Richardson',STR_TO_DATE('02/04/25', '%m/%d/%y'),STR_TO_DATE('09/23/25', '%m/%d/%y'),4700,'1',3);
INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES ('1260 20th Ave','3','32612','Richardson Anna',STR_TO_DATE('06/16/25', '%m/%d/%y'),STR_TO_DATE('11/17/25', '%m/%d/%y'),5000,'1',3);
INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES ('5239 13th St','1','32610','Alwardi Blain',STR_TO_DATE('02/01/25', '%m/%d/%y'),STR_TO_DATE('08/14/25', '%m/%d/%y'),5000,'0',0);
INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES ('1904 19th Ln','3','32606','Jack Georgina',STR_TO_DATE('12/07/24', '%m/%d/%y'),STR_TO_DATE('05/23/25', '%m/%d/%y'),4000,'0',2);
INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES ('3344 7th Ln','10','32603','Sally Julia',STR_TO_DATE('04/19/25', '%m/%d/%y'),STR_TO_DATE('03/05/26', '%m/%d/%y'),4300,'0',3);
INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES ('5940 8th Boulevard','12','32612','Aelly Maxwell',STR_TO_DATE('03/18/25', '%m/%d/%y'),STR_TO_DATE('01/24/26', '%m/%d/%y'),1600,'0',1);
INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES ('4935 16th St','4','32604','Bill Jack',STR_TO_DATE('09/25/25', '%m/%d/%y'),STR_TO_DATE('06/16/26', '%m/%d/%y'),1400,'0',0);
INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES ('5997 14th Avenue','1','32611','Elliot May',STR_TO_DATE('12/26/24', '%m/%d/%y'),STR_TO_DATE('08/08/25', '%m/%d/%y'),3400,'1',0);
INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES ('3265 16th Lane','9','32602','James Anna',STR_TO_DATE('02/23/25', '%m/%d/%y'),STR_TO_DATE('11/07/25', '%m/%d/%y'),1100,'0',2);
INSERT INTO Property (street, unit, zipcode, owner, startDate, endDate, price, available, numOfRoommates) VALUES ('3597 6th Blvd','9','32612','Alwardi May',STR_TO_DATE('04/19/25', '%m/%d/%y'),STR_TO_DATE('02/05/26', '%m/%d/%y'),4400,'0',0);
