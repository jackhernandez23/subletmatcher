# Dependencies
- MySQL
- flask (Pip)
- flask_cors (Pip)
- mysql.connector (Pip)

# How to run
Update the config variable in app.py and fake_data.py with you local MySQL credentials

(Or create a config file `sm_db_config.ini` in the root dir, should be like

	[creds]
	servername=localhost
	username=USERNAME
	password=PASSWORD
	dbname=sublet_matcher
	
Once that is all set up, go to the backend directory and `python3 -m run flask --app app run`
