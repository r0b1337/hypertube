# executing init.sql on mysql container
docker exec -it mysql mysql -pgayadmin -e "source docker-entrypoint-initdb.d/init.sql" &> /dev/null
ret=$?
if [ $ret -ne 0 ]
then
	echo "Hypertube is not running."
else
	echo "Done, init.sql has been executed."
fi
