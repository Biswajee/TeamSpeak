# TeamSpeak for codechef teams

[![GitHub issues](https://img.shields.io/github/issues/Biswajee/TeamSpeak.svg)](https://github.com/Biswajee/TeamSpeak/issues)
[![GitHub license](https://img.shields.io/github/license/Biswajee/TeamSpeak.svg)](https://github.com/Biswajee/TeamSpeak/blob/master/LICENSE)
[![](https://images.microbadger.com/badges/image/biswajee/chatvibes_app.svg)](https://hub.docker.com/r/biswajee/chatvibes_app/)
[![](https://images.microbadger.com/badges/version/biswajee/chatvibes_app.svg)](https://hub.docker.com/r/biswajee/chatvibes_app/)

## Introduction
TeamSpeak allows participation in coding/hackathon events in a more fun way where you can discuss about ways to solve a problem to ways to design the architecture.

Life wasn't that fun communicating in regular chat platforms where the discussions related to a problem set gets lost in midst of mere chats. Also, people make you get engaged in conversations and somewhat distracts you. You don't want that to happen to your passion. This is why this dedicated chat platform is needed for passionate teams (even parted by distance) can communicate their thoughts and ideas to solve a bigger problem.

## Prerequisites

This repository is all about a chat application `TeamSpeak` which uses:
+ NodeJS Express
+ MongoDB
+ SocketIO
+ Codechef OAuth2.0 API
+ Docker container orchestration
+ Finally, hosted on Alibaba Cloud ECS instance

That's all :)

## Is the application live ?
You can find the application running on http://149.129.137.246 until October 10, 2018 only.

But what after that ?

## Deployment and running

The application is a docker container application which can run on any platform and can be shipped anywhere with just `pull` and `run`.

Here's what to be done,

Get yourself a cloud instance with Ubuntu as OS (I have used **Alibaba Cloud ECS instance** with **Ubuntu 16.04**). Other instance with different versions of Ubuntu may differ a bit. The following steps will guide you to install docker in **Ubuntu 16.04**:

_**Note**: Head to point 3. if you already have docker running locally._

1. **SSH** into your cloud platform from a local machine (*Ubuntu*)

2. After you make a successful login to your instance with Ubuntu 16.04, execute the following commmands for a successful docker installation.
 + `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`

  + `sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"`

  or

  + `sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable edge"`

  + `sudo apt-get update`

  + `apt-cache policy docker-ce`

  + `sudo apt-get install -y docker-ce`

  Perform the below operation to check docker installation:

  + `sudo systemctl status docker`

  If everything went correctly, you should see:

  + `docker.service - Docker Application Container  Engine Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2018-09-29 00:09:07 UTC; 1 days ago
     Docs: https://docs.docker.com
     Main PID: 1127 (docker)`

3. Run the following commands to start the application:
 + `docker run -d --name mongo mongo`

 This will pull the official **MongoDB** docker image to your instance. Next,
  + `docker run --name codechef --link mongo:mongo -p 80:80 -d biswajee/chatvibes_app`


  Well, now do a quick `docker ps` to see if everything is fine. It should.

  _**Brief**: The docker repo is named so because I hadn't thought of `TeamSpeak` back then when I started developing :P_

  ## Configuring the Codechef OAuth2.0 API

  1. Visit https://www.developers.codechef.com and create an application.

  2. Add your website URL and redirect URL and edit the same in the application.

  3. You may need to run `docker build -t biswajee/chatvibes_app .` to reorganize everything.

  4. Finally make a `docker pull biswajee/chatvibes_app` and run it in your instance.

## Navigating through the website

The website at http://149.129.137.246 is built using **BootStrap** and **Materialize** CSS.

+ Click the **Login with Codechef** button.

+ You will be redirected to **Codechef OAuth2.0 service**. Click allow to allow access to your profile information.

+ The website will redirect you to a chat portal.

+ Here, you can get a **Unique Team ID** (only once after each login to prevent random chat ID entries).

+ Now you can ask your friend to enter the same **Team ID** into his chat portal after logging in with codechef.

+ This establishes a **socket connection** between the team members (_two or more can communicate_) and have a serious conversation on their problem without any distraction.

+ At the end of their conversation, each one can **logout** of their portal.

+ Their chat data stays safe in the **MongoDB container** which is running always in the instance.

+ At a later point of time, the team members can enter their **Team ID** to see their previous chat and can continue conversation on the same thread or get a **New ID** and start a brand new conversation with same or different members.

## Open source ?

The repository is not accepting any **pull requests** for now as it is under evaluation for **Codechef API Hackathon 2018**. Thank you for your interest in the repository.

## Moments of hardwork
Cloud was completely new to me and I ended up with 180 pulls during development ! :P

![Alt text](screenshots/docker_repo.png?raw=true)
