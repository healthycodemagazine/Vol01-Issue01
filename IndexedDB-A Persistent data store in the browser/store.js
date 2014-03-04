/*
   http://healthycodemagazine.com
   Volume 01, Issue 01
*/



//////////////////////////////////
// Code to create object store in IndexedDB
// Add-Delete-List objects
//////////////////////////////////

var healthyCodeSeminar;

function createParticipantStore(){
	var participant1 = {name:"Sam",company:"DuraSoft",designation:"Developer"};
	var participant2 = {name:"Ram",company:"Yahoo",designation:"Architect"};

	var request = indexedDB.open("HealthyCode Seminar",1);
	request.onsuccess = function(){
		healthyCodeSeminar = request.result;
	}
	request.onerror = function(event){
		console.log("Error");
		console.log(event);
	}
	request.onupgradeneeded = function(event){
		 healthyCodeSeminar = event.target.result;
		 healthyCodeSeminar.createObjectStore("ParticipantStore",{autoIncrement:true});
	}		
}

function addParticipant(){
	var txn = healthyCodeSeminar.transaction(["ParticipantStore"],"readwrite");
	var participantStore = txn.objectStore("ParticipantStore");	
	txn.oncomplete = function(event){
		jQuery("#addmsg").text("Object added successfully");
	}
	txn.onerror = function(event){
		jQuery("#addmsg").text("Error adding object");	
		console.log("Error: " + event);
	}
	participantStore.add({
		name:jQuery("#nametext").val(),
		company:jQuery("#companytext").val(),
		designation:jQuery("#designationtext").val()
	});
}

function listParticipants(){
	var txn = healthyCodeSeminar.transaction("ParticipantStore","readonly");
	var participantStore = txn.objectStore("ParticipantStore");
	jQuery("#participantslist").html("");
	var cursorRequest = participantStore.openCursor();
	cursorRequest.onsuccess = function(event){
		var participantCursor = event.target.result;
		if(participantCursor){
			var li = "<li>";
			li += participantCursor.key + ": " + 
				participantCursor.value["name"] + ", " + 
				participantCursor.value["company"] + ", " +
				participantCursor.value["designation"];
			li += "</li>";
			jQuery("#participantslist").append(li);
			participantCursor.continue();
		}	
	} 
}

function removeParticipant(){
	var participantId = jQuery("#participantidtext").val();
	var txn = healthyCodeSeminar.transaction("ParticipantStore","readwrite");
	var participantStore = txn.objectStore("ParticipantStore");
	var req = participantStore.delete(parseInt(participantId));
	txn.oncomplete = function(event){
		jQuery("#delmsg").text("Object deleted successfully");
	}
	txn.onerror = function(event){
		console.log("Error deleting object");
		console.log(event);
	}
}