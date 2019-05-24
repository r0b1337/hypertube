# hypertube

### synopsis
Ce projet vous propose de créer une application web permettant à un utilisateur de
rechercher et visionner des vidéos.
Le lecteur sera directement intégré au site, et les vidéos seront téléchargées au travers
du protocole BitTorrent.

### technologies we'll use
> **[Node.js](https://nodejs.org/)**<br>
> **[React](https://reactjs.org/)**<br>
> **[MySQL](https://www.mysql.com/)**<br>
> we'll keep our old Matcha API and wrapped functions for mysql calls and improve it 

### Requirements
> **Docker**<br>

### Installation
```
git clone https://github.com/r0bsama/hypertube.git && cd hypertube
docker-compose up
```
or to do a clean fresh install
```
bash run.sh
```
will clean every docker images and volumes and repull/rebuild everything

### differents pages
> **front-end routes/pages**
```
/
```
```
/sign/in
/sign/up
/sign/out
```
```
/profile
/profile/:id
/settings
```
```
/account/confirm
/account/reset_password
```
```
/library
```
```
/v/:id
```

### apis
https://popcorntime.api-docs.io/api/welcome/introduction<br>
https://yts.am/api<br>
https://www.themoviedb.org/documentation/api (to get more data on movies)<br>
http://www.legittorrents.info/index.php?page=torrents&category=1<br>
https://github.com/davidgatti/How-to-Stream-Movies-using-NodeJS
