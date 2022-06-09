var express = require('express');
const res = require('express/lib/response');
var app = express();
var mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded());

var port=3000;

/////////////////////////////////
//static files///
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/html', express.static(__dirname + 'public/html'));
app.use('/js', express.static(__dirname + 'public/js'));
/////////////////////////////////

let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();
var current_date = year+"-"+month+"-"+date;
// prints date in YYYY-MM-DD format
console.log(year + "-" + month + "-" + date);

mongoose.connect("mongodb+srv://niths:abcd@cluster0.dcjquke.mongodb.net/metier", {
   useNewUrlParser : true, 
   useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.set('views', './views');

var user_schema = mongoose.Schema({
   username: String,
   password: String,
   age: Number,
   email: String,
   type: String
});
var User = mongoose.model("User", user_schema);


var compuser_schema = mongoose.Schema({
    c_username: String,
    c_id: Number, 
    password: String,
    city: String,
    image: String
})
var Compuser = mongoose.model("Compuser", compuser_schema);

var uniuser_schema = mongoose.Schema({
    u_username: String,
    u_id: Number, 
    password: String,
    city: String,
    image: String
})
var Uniuser = mongoose.model("Uniuser", uniuser_schema);

var company_schema = mongoose.Schema({
    c_id: String,
    c_name: String,
    category: String,
    type: String,
    city: String,
    qualification: String
})
var Company = mongoose.model("Company", company_schema);

var university_schema = mongoose.Schema({
    u_id: String,
    u_name: String,
    city: String,
    duration: Number,
    category: String
})
var University = mongoose.model("University", university_schema);

var category_schema = mongoose.Schema({
    category_id: String,
    job_type: String
})
var Category = mongoose.model("Category", category_schema);

var application_schema = mongoose.Schema({
    appl_id:Number,
    username: String,
    date_of_appl: Date,
    c_name: String,
    u_name: String,
    type: String,
    status: String,
    resume: String,
    category: String
    
})
var Application = mongoose.model("Application", application_schema);

app.get('/', function(req, res){
    res.render('index');
})

app.get('/signup', function(req, res){
   res.render('signup');
});

app.get('/company_signup', function(req, res){
   res.render('company_signup');
});

app.post('/company_signup', function(req, res){
    var user_info = {username: req.body.cusername, password:req.body.password, city:req.body.city, link: req.body.link};

    if(!user_info.username || !user_info.city || !user_info.password){
      res.render('comp_login_dashboard', {
         message: "Sorry, you provided wrong info", mtype: "error"}); 
   } else { 
    Compuser.exists({ c_username: user_info.cusername}, 
    function (err, doc) {
    if (err){
        console.log(err);
    }
    else{
        console.log(doc);
        if(doc){
            console.log("User already exists!");
            res.render('cuser_exists');
        }
        else{
            console.log("Creating new company...")
            var new_user = new Compuser({
            c_username: user_info.username,
            c_id: Math.floor((Math.random() * 100) + 1),
            city: user_info.city,
            password: user_info.password,
            link: user_info.link
            });
            new_user.save(function(err, Compuser){
            if(err)
                res.render('comp_login_dashboard', {message: "Database error", mtype: "error"});
            else
                res.render('comp_login_dashboard', {
                message: "New user signed up!", mtype: "success", person: user_info});
      });
        }
    }
    
    
});
}
});

app.post('/university_signup', function(req, res){
    var user_info = {username: req.body.uusername, password:req.body.password, city:req.body.city, link: req.body.link};

    if(!user_info.username || !user_info.city || !user_info.password){
      res.render('university_login_dashboard', {
         message: "Sorry, you provided wrong info", mtype: "error"}); 
   } else { 
    Uniuser.exists({ u_username: user_info.username}, 
    function (err, doc) {
    if (err){
        console.log(err);
    }
    else{
        console.log(doc);
        if(doc){
            console.log("User already exists!");
            res.render('uuser_exists');
        }
        else{
            console.log("Creating new company...")
            var new_user = new Uniuser({
            u_username: user_info.username,
            u_id: Math.floor((Math.random() * 100) + 1),
            city: user_info.city,
            password: user_info.password,
            link: user_info.link
            });
            new_user.save(function(err, Uniuser){
            if(err)
                res.render('university_login_dashboard', {message: "Database error", mtype: "error"});
            else
                res.render('university_login_dashboard', {
                message: "New user signed up!", mtype: "success", person: user_info});
      });
        }
    }
    
    
});
}
});

app.post('/signup', function(req, res){
    var user_info = {username: req.body.username, password:req.body.password, age:req.body.age, type: req.body.type, email: req.body.email};

    if(!user_info.username || !user_info.age || !user_info.password || !user_info.email || !user_info.type){
      res.render('login_dashboard', {
         message: "Sorry, you provided wrong info", mtype: "error"});
   } else {
    User.exists({ username: user_info.username}, 
    function (err, doc) {
    if (err){
        console.log(err);
    }
    else{
        if(doc){
            console.log("User already exists!");
            res.render('user_exists');
        }
        else{
            console.log("Creating new user...")
            var new_user = new User({
            username: user_info.username,
            age: user_info.age,
            password: user_info.password,
            type: user_info.type,
            email: user_info.email
            });
            new_user.save(function(err, User){
            if(err)
                res.render('login_dashboard', {message: "Database error", mtype: "error"});
            else
                res.render('login_dashboard', {
                message: "New user signed up!", mtype: "success", person: user_info});
      });
        }
    }
    
    
});
}
});

app.get('/login', function(req, res){
   res.render('login');
});

app.get('/company_login', function(req, res){
   res.render('company_login');
});

app.get('/company_signup', function(req, res){
   res.render('company_signup');
});

app.get('/university_login', function(req, res){
   res.render('university_login');
});

app.get('/university_signup', function(req, res){
   res.render('university_signup');
});

app.post('/login', function(req, res){
    var user_info = {username: req.body.username, password:req.body.password};

    if(!user_info.username || !user_info.password ){
      res.render('login_dashboard', {
         message: "Sorry, you provided incomplete info", mtype: "error"});
   } 
   else{
    User.exists({ username: user_info.username, password: user_info.password}, 
    function (err, doc) {
        if (err){
            console.log(err);
        }
        else{
            if(doc){
                console.log(user_info);
                console.log("hey");
                res.render('login_dashboard', {
                    message: "User logged in!", 
                    mtype: "success", 
                    person: user_info});
            }
            else{
                        res.render('login_dashboard', {
                            message: "Incorrect Credentials! Please try again.",
                            mtype: "error"
                        });
            }
        }
    });
    }
});

app.post('/company_login', function(req, res){
    var user_info = {username: req.body.username, password:req.body.password};

    if(!user_info.username || !user_info.password ){
      res.render('comp_login_dashboard', {
         message: "Sorry, you provided incomplete info", mtype: "error"});
   } 
   else{
    Compuser.exists({ c_username: user_info.username, password: user_info.password}, 
    function (err, doc) {
        if (err){
            console.log(err);
        }
        else{
            if(doc){
                Compuser.find({username: user_info.username, password: user_info.password},
                    function(err, response){
                        console.log(user_info);
                        console.log(response);
                        console.log("hey");
                        res.render('comp_login_dashboard', {
                        message: "You're logged in!", 
                        mtype: "success", 
                       person: user_info});
                    })
                
            }
            else{
                        res.render('comp_login_dashboard', {
                            message: "Incorrect Credentials! Please try again.",
                            mtype: "error"
                        });
            }
        }
    });
    }
});

app.post('/university_login', function(req, res){
    var user_info = {username: req.body.username, password:req.body.password};

    if(!user_info.username || !user_info.password ){
      res.render('university_login_dashboard', {
         message: "Sorry, you provided incomplete info", mtype: "error"});
   } 
   else{
    Uniuser.exists({ u_username: user_info.username, password: user_info.password}, 
    function (err, doc) {
        if (err){
            console.log(err);
        }
        else{
            if(doc){
                Uniuser.find({username: user_info.username, password: user_info.password},
                    function(err, response){
                        console.log(user_info);
                        console.log(response);
                        console.log("hey");
                        res.render('university_login_dashboard', {
                        message: "You're logged in!", 
                        mtype: "success", 
                        image: response,
                       person: user_info});
                    })
                
            }
            else{
                        res.render('university_login_dashboard', {
                            message: "Incorrect Credentials! Please try again.",
                            mtype: "error"
                        });
            }
        }
    });
    }
});
   
app.get('/openings', function(req, res){
    var usrname = req.query.usrname;
    res.render('openings',{
        usrname: usrname
    });
});

app.get('/fulltime', function(req, res){
    
    Company.find(function(err, response){
        var usrname = req.query.usrname;
            res.render('fulltime', {
            companies: response,
            usrname: usrname
        });
        
        
    })
});

app.get('/internships', function(req, res){

    University.find(function(err, response1){
        
        Company.find({type: "Internship"},
    function(err, response2){
        var usrname = req.query.usrname;
        res.render('internships',{
            companies:response2,
            universities: response1,
            usrname: usrname
        })
    })
    })

    
});

app.get('/addcompany', function(req, res){

    res.render('addcompany');
});

app.get('/adduniversity', function(req, res){

    res.render('adduniversity');
});

app.post('/addcompany', function(req, res){
    var company_info = req.body;

    if(!company_info.c_name || !company_info.category || !company_info.type || !company_info.city || !company_info.qualification ){
      res.render('compadd', {
         message: "Sorry, you provided incomplete info", mtype: "error"});
   } 
   else{
                var new_company = new Company({
            c_name: company_info.c_name,
            c_id: Math.floor((Math.random() * 100) + 1) ,
            category: company_info.category,
            qualification: company_info.qualification,
            city: company_info.city,
            type: company_info.type,
            });
            new_company.save(function(err, Company){
            if(err)
                res.render('compadd', {message: "Database error", mtype: "error"});
            else
                res.render('compadd', {
                message: "New opening created!", mtype: "success", person: company_info});
            })
            
      
    }
});

app.post('/adduniversity', function(req, res){
    var uni_info = req.body;

    if(!uni_info.u_name || !uni_info.category || !uni_info.duration || !uni_info.city || !uni_info.qualification ){
      res.render('univadd', {
         message: "Sorry, you provided incomplete info", mtype: "error"});
   } 
   else{
                var new_company = new University({
            u_name: uni_info.u_name,
            u_id: Math.floor((Math.random() * 100) + 1) ,
            category: uni_info.category,
            qualification: uni_info.qualification,
            duration: uni_info.duration,
            city: uni_info.city,
            
            });
            new_company.save(function(err, University){
            if(err)
                res.render('univadd', {message: "Database error", mtype: "error"});
            else
                res.render('univadd', {
                message: "New opening created!", mtype: "success", person: uni_info});
            })
            
      
    }
});

app.post('/compadd', function(req, res){
    var comp = req.body.comp;
    res.render('comp_login_dashboard', {
        person:null,
        comp: comp,
        message: "Welcome!",
        mtype:"success"
        
    })
})

app.post('/univadd', function(req, res){
    var uni = req.body.uni;
    res.render('university_login_dashboard', {
        person:null,
        uni: uni,
        message: "Welcome!",
        mtype:"success"
        
    })
})

app.post('/comp_login_dashboard', function(req, res){
    var comp = req.body.comp;
    Application.find({c_name:comp},
        function(err, result){
            if(err){
                console.log("error");
            }
            else{
                res.render('company_appl',{
                    info: result,
                    cname: comp
                })
            }
        })
})

app.post('/university_login_dashboard', function(req, res){
    var uni = req.body.uni;
    Application.find({u_name:uni},
        function(err, result){
            if(err){
                console.log("error");
            }
            else{
                res.render('university_appl',{
                    info: result,
                    uname: uni
                })
            }
        })
})

app.post('/company_appl', function(req, res){
    var formresult = req.body.ress;
    var comp = req.body.comp;
    var appl_id=req.body.appl_id;
    Application.find({appl_id:appl_id},
        function(err, result){
            if(err){
                console.log("error");
            }
            else{
                var info=result;
                console.log(comp);
    console.log(result);
    if(formresult=="Accept"){
        Application.findOneAndUpdate({appl_id:appl_id},{status:"Accepted"}, 
        function(err, res1){
            console.log("Updated!");
            console.log(res1);
            res.render('company_appl',{
                info:info,
                cname:comp,
                appl_id:appl_id
            })

        })
    }
    else{
        Application.findOneAndUpdate({c_name:comp},{status:"Rejected"}, 
        function(err, res2){
            console.log("Updated!");
            res.render('company_appl',{
                info:info,
                cname:comp,
                appl_id:appl_id
            })
        })
    }
            }
        })
    
})

app.post('/university_appl', function(req, res){
    var formresult = req.body.ress;
    var uni = req.body.uni;
    var appl_id=req.body.appl_id;
    Application.find({appl_id:appl_id},
        function(err, result){
            if(err){
                console.log("error");
            }
            else{
                var info=result;
                console.log(uni);
    console.log(result);
    if(formresult=="Accept"){
        Application.findOneAndUpdate({appl_id:appl_id},{status:"Accepted"}, 
        function(err, res1){
            console.log("Updated!");
            console.log(res1);
            res.render('university_appl',{
                info:info,
                uname:uni,
                appl_id:appl_id
            })

        })
    }
    else{
        Application.findOneAndUpdate({appl_id:appl_id},{status:"Rejected"}, 
        function(err, res2){
            console.log("Updated!");
            res.render('university_appl',{
                info:info,
                uname:uni,
                appl_id:appl_id
            })
        })
    }
            }
        })
    
})



app.get('/categories', function(req, res){
    Category.find(function(err, response){
        var usrname = req.query.usrname;
        res.render('categories', {
            categories: response,
            usrname: usrname
        });
    })
});

app.post('/categories', function(req, res){
    var category = req.body.category;
    var usrname = req.body.usrname;
    Company.find({category: category},
         function(err, response){
        res.render('category_openings', {
            category: response,
            usrname: usrname
        });
    })
})

app.get('/application', function(req, res){
    res.render('application');
})

app.post('/applied', function(req, res){
    var compinfo = req.body.comp;
    var name = req.body.usr;
    var pos = req.body.pos;
    Application.find({username: name}, 
        function(err, response){
            if(err){
                console.log("error");
            }
            else{
                res.render('all_applications',{
                    info: response,
                    usrname: name,
            
        })
    }
})
})

app.post('/fulltime', function(req, res){
    var compinfo = req.body.comp;
    var name = req.body.name;
    res.render('application',{
        info: compinfo,
        usrname: name

    })
})

app.post('/internships', function(req, res){
    var compinfo = req.body.comp;
    var name = req.body.name;
    res.render('application',{
        info: compinfo,
        usrname: name

    })
})

app.post('/category_openings', function(req, res){
    var compinfo = req.body.comp;
    var name = req.body.name;
    res.render('application',{
        info: compinfo,
        usrname: name

    })
})

app.post('/application', function(req, res){
    var usr = req.body.usrname;
    var comp = req.body.comp;
    var pos = req.body.pos;
    var resume = req.body.resume;
    var new_appln = new Application({
            username: usr,
            appl_id:Math.floor((Math.random() * 100) + 1),
            date_of_appln: current_date,
            c_name: comp,
            u_name: comp,
            type: "job",
            status: "not checked",
            resume:resume,
            category: "category"
            });
            new_appln.save(function(err, User){
            if(err)
                console.log("Database Error.");
            else
                res.render('applied', {
                message: "Your application has been submitted!", mtype: "success",
                usr: usr,
                pos: pos,
                comp: comp });
      });
})

app.listen(port);