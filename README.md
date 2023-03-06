# Task-Tracker-FE

### Create ESC Instance for frontend using centos 7.9 image then run the commands below :

 

- yum update -y
- yum install npm -y
- yum install httpd -y
- yum install git -y
- git clone https://github.com/Tuwaiq-Cloud-Computing/Task-Tracker-FE.git
- cd  Task-Tracker-FE 
- npm i
- vim ./src/App.js  " THIS IS COMMENT: Then add your load balancer domin to line 22 "
- npm run build
- cp -a build/. /var/www/html
- systemctl start httpd
- systemctl enable httpd

#### After running these commands create custom images of this instance and use it as auto-scaling image
