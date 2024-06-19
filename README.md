# **Old School RuneScape Grand Exchange Tracker**
by Sebastian Calderon


## Table of Contents
- [Description](#description)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Prerequisites](#prerequisites)
- [Installation](#installation)

## Description
I created this project to demonstrate my skills as a full stack developer. Leveraging Node.js with the Express framework, a PostgreSQL database, and the frontend Bootstrap framework, I aimed to create an experience similar to the layout and functionality of [Google Finance](https://www.google.com/finance/?hl=en). This involved real-time tracking of stock market ticker information, adapted to showcase the prices of items traded within the vibrant economy of Old School RuneScape (OSRS), a massively popular MMORPG developed by Jagex.

For context, Old School RuneScape boasts a dynamic player-driven economy integral to player progression and in-game activities. Much like real-world stock trading, players engage in buying and selling items to enhance their gameplay experience. Thus, the inspiration behind modeling my tracker after the user-friendly interface of Google Finance was to capture the essence of this virtual marketplace. Please be mindful of the British spelling of certain words, as the original developers are based in the UK.

None of this would be possible without the [OSRS Wiki API](https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices) that I used to pull real time pricing information for my site.

The website offers a search bar for item lookup, detailed item pages, and real-time pricing. These detailed item pages provide a summary of pricing information, ranging from current prices to yearly trends, alongside trade limits and in-game item valuations.

**My goals with this project is to demonstrate my proficiency in PostgreSQL by storing pertinent data that could be easily queried through a Node client for versatile manipulation. Additionally, I wanted to showcase the retrieval of relevant API data through Axios. Continuing to leveraging Node on the server-side, I also rendered HTML templates using EJS and delivering them to users through the Express framework. With Express, I managed request routing in an organized and easily comprehensible way.**

## Screenshots
### Homepage
![Screenshot of the main homepage of the OSRS GE Tracker showcasing the similar styling to Google Finance Page](https://github.com/sabz333/OSRS-GE-Tracker/assets/66535527/a4423d53-6352-4b71-b622-16e2364597be)
### Search Bar
![Screenshot of the main homepage of the OSRS GE Tracker showcasing the search bar for all ingame items and their current prices](https://github.com/sabz333/OSRS-GE-Tracker/assets/66535527/d1dd48e6-9494-41c2-98c9-4add4acc766e)
### Detailed Items
![Screenshot showing the detailed items page showing the changing styles based on performance](https://github.com/sabz333/OSRS-GE-Tracker/assets/66535527/57cdcc7a-4da2-4183-be34-0829484e8263)
![Screenshot showing the detailed items page showing the changing styles based on performance](https://github.com/sabz333/OSRS-GE-Tracker/assets/66535527/c42a6bbf-2450-405b-888a-bdccc78750b2)


## Roadmap
Features that I would like to add to the project:
1. **Automatic price ticker updates**
    - ~~Currently there is a script in the Script directory that I run periodically when on the site to update the prices. Need to add cron tasks to main app.~~
    **Implemented!**
2. **Better error handling**
    - Currently error handling is basic and using the default express handling. Want to add custom error page and better db error handling.
3. **Optimize for Mobile**
    - ~~Configure Bootstrap containers to create a more responsive site~~   **Implemented!**
4. **User Accounts**
    - Goal being to be able to save individual items to homepage to track
5. **Useful Tools**
    - High Alch Tracker
      - Page dedicated to tracking items that can be profitable to high alch for magic xp
    - Herblore Cost Saver
      - Find unfinished potions that provide highest xp per gp spent
   
## Prerequisites
- Node.js 20.x or higher
- NPM package manager

## Installation
Feel free to clone the site and install with npm.

Please note that you will need to standup the postgres DB using the [backup](OSRS-GE-Tracker-Postgres-DB.sql) located on the root. You will also have to modify the pg parameters [found here](db/index.js) to connect to your postgres DB instance.
