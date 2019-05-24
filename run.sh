##### /!\/!\/!\ #####
	# PAY ATTENTION
	# This is a first time startup script to ensure a clean functional installation
	# After running this script all volumes will be linked and everything will go out of the box with auto-loading developpement
	# To startup Hypertube do : docker-compose up
	# CTRL-C to stop it
##### /!\/!\/!\ #####

# stopping running docker-compose
docker-compose down

# cleaning up containers, images and volumes
docker rm $(docker ps -a -f status=exited -q)
docker rmi $(docker images -a -q)
docker volume rm $(docker volume ls -q)

# building our images
docker-compose build
# booting hypertube
docker-compose up

# done, display usage
echo "Done! To access MySQL container, run:"
echo "----------------------------------------------"
echo " docker exec -it hypertube_mysql-db_1 bash"
echo "----------------------------------------------"
echo ""
echo "To access back-end container, run:"
echo "----------------------------------------------"
echo " docker exec -it hypertube_server_1 bash"
echo "----------------------------------------------"
echo ""
echo "To access front-end container, run:"
echo "----------------------------------------------"
echo " docker exec -it hypertube_client_1 bash"
echo "----------------------------------------------"
