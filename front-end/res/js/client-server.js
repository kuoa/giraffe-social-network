/*---------------------------------------------*/
/* 				Generic functions 			   */
/*---------------------------------------------*/
		
var root = "http://li328.lip6.fr:8280/Giraffe";

function serverRequest(url, data, doneFun){
	
	var request = $.ajax({
		url : root + url,		
		data : data,
		dataType : "json"	
	});
			
	request.done(doneFun);
	
	request.fail(function(msg) {
		console.log("Fail");
		console.log(msg);
	});
}

function serverRequestAsync(url, data, doneFun){
	
	var request = $.ajax({
		url : root + url,		
		data : data,
		dataType : "json",
		async : false
	});
			
	request.done(doneFun);
	
	request.fail(function(msg) {
		console.log("Fail");
		console.log(msg);
	});
}

/*---------------------------------------------*/
/* 				    User					   */
/*---------------------------------------------*/

function login(event){
	
	var url = "/user/login";
	var user = $('#user-login').val();
	var pass = $('#pass-login').val();
	
	var data = {
		user : user,
		pass : pass
	};
	
	var doneFun = function(json){		
						
		if(json.status === "error"){
			var message = json.message;			
			$('#login-msg').text(message);
		}
		else{						
			//get bio, image, about, photos
			
			var id = json.id;
			var key = json.key;
			var friend = false;
			var login = json.username;
			var bio = "Don't forget to make api for bio."
			var image = "Don't forget to make api for image."
			var about = "Don't forget to make api for about."
			var photos = "Don't forget to make api for photos."
			
			user = new User(id, login, friend, bio, image, about, photos);
			environment.profile = user;
			environment.profile.key = key;			
			environment.users[id] = undefined;
						
			initComments();
			initFriends();
			
			generatePage();
			generateEvents();
			
			$('#login-modal').modal('toggle');
		}
	}
	
	serverRequest(url, data, doneFun);
	return false;	
}


function signin(event){
	
	var url = "/user/create";
	var user = $('#user-signin').val();
	var pass = $('#pass-signin').val();
	var passRe = $('#pass-re-signin').val();
	var mail = $('#mail-signin').val();
	
	if(pass != passRe){
		var msg = "Please provide identical passwords."
		
		$('#signin-msg').text(msg);				
		return false;
	}
	
	var data = {
		user : user,
		pass : pass,
		mail : mail,
	};
	
	var doneFun = function(json){		
						
		if(json.status === "error"){
			var message = json.message;				
			$('#signin-msg').text(message);			
		}
		else{						
			
			var msg = user + " you can now login.";
			$('#signin-msg').text(msg);
			
			$(document).ready(function() {
			    setTimeout(function() {		    	
			      $('#signIn-modal').modal('hide');
			    }, 4000); // milliseconds
			});
		}
	}	
	serverRequest(url, data, doneFun);
	return false;	
}


function logout(event){	
	
	var url = "/user/logout";
		
	var key = environment.profile.key;			
	
	var data = {
		key : key
	};
	
	var doneFun = function(json){		
						
		if(json.status === "error"){
			var message = json.message;				
			console.log(message);
		}
		
		else {
									
			initLocalData();
			initComments();
			
			generatePage();
			generateEvents();
		}
	}	
	serverRequest(url, data, doneFun);
	return false;	
}
	
/*---------------------------------------------*/
/* 				Comments					   */
/*---------------------------------------------*/

function searchComment(event){	
	
	var url = "/comments/search";
	var userLogin = '';
	var query = '';
	var forFriends = '';
	
	if (event != undefined){
		userLogin = $('#login').value();
		query = $('#query').value();
		forFriends = $('#friends').value();
	}		

	var data = {
			userLogin : userLogin,			
			query : query,
			forFriends : forFriends
	};
	
			
	function doneFun(json){		
						
		if(json.status === "error"){
			var message = json.message;				
			console.log(message);
		}
		
		else {
			new CommentList(json);				
		}
	}
	
	serverRequestAsync(url, data, doneFun);
	return false;
}

		
function getFriendsComments(event){
	
	var url = "/comments/get-for-friends";
	
	var key = environment.profile.key;
	var userLogin = environment.profile.login;
	
	var data = {
		key : key,
		userLogin: userLogin
	};
	
	function doneFun(json){		
		
		if(json.status === "error"){
			var message = json.message;				
			console.log(message);
		}
		
		else {
			new CommentList(json);				
		}
	}
	
	serverRequestAsync(url, data, doneFun);
	return false;		
}

/*---------------------------------------------*/
/* 				Friends						   */
/*---------------------------------------------*/

function getFriendsList(event){
	
	var url = "/friends/get";
	
	var key = environment.profile.key;
	var userLogin = environment.profile.login;
	
	var data = {
		key : key,
		userLogin: userLogin
	};
	
	function doneFun(json){		
		
		if(json.status === "error"){
			var message = json.message;				
			console.log(message);
		}
		
		else {
			new FriendList(json);					
		}
	}
	
	serverRequestAsync(url, data, doneFun);
	return false;		
}