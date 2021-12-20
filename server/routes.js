const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// connection details for AWS MySQL database
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// Route 1 (handler)
async function hello(req, res) {
    // a GET request to /hello?name=Steve
    if (req.query.name) {
        res.send(`Hello, ${req.query.name}! Welcome to the FIFA server!`)
    } else {
        res.send(`Hello! Welcome to the FIFA server!`)
    }
}


// Route 2 (handler)
async function jersey(req, res) {
    const colors = ['red', 'blue', 'white']
    const jersey_number = Math.floor(Math.random() * 20) + 1
    const name = req.query.name ? req.query.name : "player"

    if (req.params.choice === 'number') {
        
        res.json({ message: `Hello, ${name}!`, jersey_number: jersey_number })
    } else if (req.params.choice === 'color') {
        var lucky_color_index = Math.floor(Math.random() * 2);
        
        res.json({ message: `Hello, ${name}!`, jersey_color: colors[lucky_color_index] })
    } else {
        
        res.json({ message: `Hello, ${name}, we like your jersey!` })
    }
}


// Route 3 (handler)
async function all_matches(req, res) {
    
    const league = req.params.league ? req.params.league : 'D1'
    

    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        
        var siz = req.query.pagesize ? req.query.pagesize : 10
        var ofset = siz * (req.query.page - 1)
       
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals
        FROM Matches
        WHERE Division = '${league}'
        ORDER BY HomeTeam, AwayTeam
        LIMIT ${siz} OFFSET ${ofset};`, function(error, results, fields) {

            if(error) {
                console.log(error)
                res.json({error: errror})
            }else if (results) {
                res.json({ results: results})
            }
        });
   
    } else {
        
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
        FROM Matches 
        WHERE Division = '${league}'
        ORDER BY HomeTeam, AwayTeam`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// Route 4 (handler)
async function all_players(req, res) {

    if (req.query.page && !isNaN(req.query.page)) {
        
        var siz = req.query.pagesize ? req.query.pagesize : 10
        var ofset = siz * (req.query.page - 1)
        var query = `SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
        FROM Players
        ORDER BY Name
        LIMIT ${siz} OFFSET ${ofset};`;
        connection.query(query, function(error, results, fields) {

            if(error) {
                console.log(error)
                res.json({error: errror})
            }else if (results) {
                res.json({ results: results})
            }
        });
   
    } else {
        
        connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
        FROM Players
        ORDER BY Name`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }

}


// Route 5 (handler)
async function match(req, res) {
   

    if (req.query.id && !isNaN(req.query.id)) {
        
        const mid = req.query.id
        var query = `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals, 
        HalfTimeGoalsH AS HTHomeGoals, HalfTimeGoalsA AS HTAwayGoals, ShotsH AS ShotsHome, ShotsA AS ShotsAway, ShotsOnTargetH AS ShotsOnTargetHome, 
        ShotsOnTargetA AS ShotsOnTargetAway, FoulsH AS FoulsHome, FoulsA AS FoulsAway, CornersH AS CornersHome, CornersA AS CornersAway, 
        YellowCardsH AS YCHome, YellowCardsA AS YCAway, RedCardsH AS RCHome, RedCardsA AS RCAway
        FROM Matches
        WHERE MatchId = '${mid}' `;
        connection.query(query, function(error, results, fields) {

            if(error) {
                console.log(error)
                res.json({error: error})
            }else {
                res.json({ results: results})
            }
        });
   
    } else {
        res.json({ message: 'MatchId provided is not a Number' })
    }

}


// Route 6 (handler)
async function player(req, res) {
   
    if (req.query.id && !isNaN(req.query.id)) {
        
        const pid = req.query.id
        var query = `SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating AS Rating, Potential, Club, ClubLogo, 
        Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition, BestOverallRating, 
        ReleaseClause, GKPenalties, GKDiving, GKHandling, GKKicking, GKPositioning, GKReflexes
        FROM Players
        WHERE PlayerId = '${pid}' AND BestPosition = 'GK'`;
        connection.query(query, function(error, results, fields) {

            if(error) {
                console.log(error)
                res.json({error: error})
            }else if (results.length !== 0){
                res.json({ results: results})
            }else {
                var myquery = `SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating AS Rating, Potential, Club, ClubLogo, 
                Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition, BestOverallRating, 
                ReleaseClause, NPassing, NBallControl, NAdjustedAgility, NStamina, NStrength, NPositioning
                FROM Players
                WHERE PlayerId = '${pid}' AND BestPosition != 'GK'`;
                connection.query(myquery, function(error, results, fields){
                    if(error) {
                        console.log(error)
                        res.json({error: error})
                    }else {
                        res.json({ results: results})
                    }
                })
            }
        });
   
    } else {
        res.json({ message: 'PlayerId provided is not a Number' })
    }
}


// Route 7 (handler) SQL query to query the FIFA Team information by specified matching Home Team and Away Team 
async function search_matches(req, res) {
   
    const home = req.query.Home ? req.query.Home : ''
    const away = req.query.Away ? req.query.Away : ''
    
    if (req.query.page && !isNaN(req.query.page)) {
        
        const siz = req.query.pagesize ? req.query.pagesize : 10
        const ofset = siz * (req.query.page - 1)
        
        var query = `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals
        FROM Matches
        WHERE HomeTeam LIKE '%${home}%' AND AwayTeam LIKE '%${away}%'
        ORDER BY Home, Away 
        LIMIT ${siz} OFFSET ${ofset}`; 
        
        connection.query(query, function(error, results, fields) {

            if(error) {
                console.log(error)
                res.json({error: errror})
            }else {
                res.json({ results: results})
            }
        });
   
    } else {
        
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals
        FROM Matches
        WHERE HomeTeam LIKE '%${home}%' AND AwayTeam LIKE '%${away}%'
        ORDER BY Home, Away `, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else {
                res.json({ results: results })
            }
        });
    }
    


}

// Route 8 (handler) Search FIFA player by name, nationality and club name, overallRating and potentials.
async function search_players(req, res) {
    
    const rlow = req.query.RatingLow ? req.query.RatingLow : 0 
    const rhigh = req.query.RatingHigh ? req.query.RatingHigh : 100
    const plow = req.query.PotentialLow ? req.query.PotentialLow : 0 
    const phigh = req.query.PotentialHigh ? req.query.PotentialHigh : 100
    const name = req.query.Name ? req.query.Name : ''
    const nations = req.query.Nationality ? req.query.Nationality : ''
    const club = req.query.Club ? req.query.Club : ''
 
    if (req.query.page && !isNaN(req.query.page)) {
        
        const siz = req.query.pagesize ? req.query.pagesize : 10
        const ofset = siz * (req.query.page - 1) 

        var query = `SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
        FROM Players
        WHERE Name LIKE '%${name}%' AND Nationality LIKE '%${nations}%' AND Club LIKE '%${club}%'
        AND OverallRating >= ${rlow} AND OverallRating <= ${rhigh} AND Potential >= ${plow} AND Potential <= ${phigh}
        ORDER BY Name 
        LIMIT ${siz} OFFSET ${ofset}`; 
        
        connection.query(query, function(error, results, fields) {

            if(error) {
                console.log(error)
                res.json({error: errror})
            }else {
                res.json({ results: results})
            }
        });
   
    } else {
        
        connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
        FROM Players
        WHERE Name LIKE '%${name}%' AND Nationality LIKE '%${nations}%' AND Club LIKE '%${club}%'
        AND OverallRating >= ${rlow} AND OverallRating <= ${rhigh} AND Potential >= ${plow} AND Potential <= ${phigh}
        ORDER BY Name`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else {
                res.json({ results: results })
            }
        });
    }
    
}

module.exports = {
    hello,
    jersey,
    all_matches,
    all_players,
    match,
    player,
    search_matches,
    search_players
}