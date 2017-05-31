var dataset = []

function newTagjQuery(tagType, parent, text, newclass){
  var elementName=$('<'+tagType+'>');
  elementName.appendTo(parent).text(text).addClass(newclass);
  return elementName;
}

function newtablerow(tablebody, newclass, id) {
  var tr= newTagjQuery('tr', tablebody, '', newclass);
  tr.attr('id', id);
  return tr;
}

function newtablecolumn(tablerow, id, text, editable, newclass) {
  var td= newTagjQuery('td', tablerow, text, newclass);
  td.attr('id', id)
  td.attr('contenteditable', editable);
  return td;
}

var tablebody=$('<tbody>');

function maketable(data) {
  event.preventDefault();
  removerows()
  for (var i = 2; i < data.length; i++) {
    var person = data[i];
    console.log(person,person.Q18_1 );
    var newer=false;
    if (person.Q18_1){
      var name = person.Q18_1 + ', ' + person.Q18_2;
      newer=true;
    }
    else{
      var name = person['Q3_7_TEXT'];
    }
    if (!name) {
      console.log('no name');
      break
    }
    displayname = checkfirstname(name);
    names= displayname.split(',');
    if (names.length==1){
      names.push('missing')
    }
  if (name && name!='Revathy N'&& name !=
 'Lee, Yee Ming' &&  name !='u1252073' && name != 'Rossiter, Jennifer' && name != 'Niloufar Farzan') {
      var isnew = true;
      if (dataset.length>=1) {
          isnew = checkNew(name)
          }

      if (isnew){
        var dieaseList = allAnswers("Q7", person);
        var expertiseList = allAnswers("Q8", person);
        var resourceList = allAnswers("Q15", person);
        var row= newtablerow('#for-approval', displayname)
        var col1= newtablecolumn(row, 'approved', 'approved', true)
        var col2= newtablecolumn(row, names[1], names[1], true, 'firstname')
        var col3= newtablecolumn(row, names[0], names[0], true, 'lastname')
        var col4= newtablecolumn(row, name, name, false, 'lastname')
        var col5= newtablecolumn(row, person['Q3_1'], person['Q3_1'], true, "email")
        var col6= newtablecolumn(row, person['Q3_2'], person['Q3_2'], true, "phone")
        if (newer){
          var col7= newtablecolumn(row, person['Q3_13'], person['Q3_13'], true, "address")
          var col8= newtablecolumn(row, person['Q3_14'], person['Q3_14'], true, "state")
          var col9= newtablecolumn(row, person['Q3_3'], person['Q3_3'], true, "country")
        }
        else{
          var col7= newtablecolumn(row, person['Q3_3_TEXT'], person['Q3_3_TEXT'], true, "address")
          var col8= newtablecolumn(row, '', '', true, "state")
          var col9= newtablecolumn(row, '', '', true, "country")
        }
        var col10= newtablecolumn(row, person['Q3_4'], person['Q3_4'], true, "title")
        var col11= newtablecolumn(row, person['Q4'], person['Q4'], true)
        var col12= newtablecolumn(row, person['Q3_5'], person['Q3_5'], true,   "intitution")
        var col13= newtablecolumn(row, person['Q3_5'], person['Q3_5'], true,   "intitution")
        var col14= newtablecolumn(row, person['Q6'], person['Q6'], true, "other")
        var col15= newtablecolumn(row, dieaseList.join(', '), dieaseList.join(', '), true, "dieases")
        var col16= newtablecolumn(row, expertiseList.join(', '), expertiseList.join(', '), true, "expertise")
        var col17= newtablecolumn(row, resourceList.join(', '), resourceList.join(', '), true, "resources")

        dataset.push({
          "name":displayname,
          "email": person['Q3_1'],
          "phone": person['Q3_2'],
          "address": person['Q3_3'],
          "title": person['Q3_4'],
          "intitution": person['Q3_5'],
          "other": person['Q6'],
          "dieases": dieaseList.join(', '),
          "expertise": expertiseList.join(', '),
          "resources": resourceList.join(', '),
        })
        }



  }
}
}
function checkNewFormat(){

}

function checkNew(newname){
  for (var i = 0; i < dataset.length; i++) {
    if (newname == dataset[i].name){
      // console.log("repeat, "+newname+', '+dataset[i].name);
      return false;
      }
      else {
        return true
      };
  }
}

function checkfirstname(name){
  if (name.includes(',')) {
    return name;
  }
  else if (name.includes(' ')) {
    var fullname= name.split(' ')
    return fullname[1]+', '+fullname[0]
  }
  else return name;
}

function removerows(){
  rows=$('tr')
  for (var i = 1; i < rows.length; i++) {
    $(rows[i]).remove()
  }
}

function allAnswers(question, obj){
  var answers = []
  var ondeck=[];

  for (key in obj){
    // debugger
    if (obj.hasOwnProperty(key)){
      if(key.indexOf(question)===0){
        // debugger
        // console.log(key, obj[key]);
          if (obj[key].includes('type')||obj[key].includes('describe')||obj[key].includes('specify')) {
            // debugger
            if (obj[key]) {
              var newvalue=obj[key].replace(/ *\([^)]*\) */g, "")
              var newobj={}
              var newkey=key+"_TEXT"
              newobj[newkey]=newvalue
              ondeck.push(newobj);

              // console.log('newkey='+newkey+'newvalue='+newvalue);
              }

          }
          else if (key.includes("TEXT")) {
            // console.log(key, obj[key], ondeck);
            for (var i = 0; i < ondeck.length; i++) {
              if (ondeck[i].hasOwnProperty(key)){
                if (obj[key]){
                answers.push(ondeck[i][key]+':'+obj[key])
                // console.log("ondeck and obj "+ondeck[i][key]+':'+obj[key]);
              }
                else {
                  answers.push(ondeck[i][key])
                  // console.log("ondeck only "+ondeck[i][key]+':'+obj[key]);

                }

            }
          }
          }
          else if (obj[key]){
            // console.log("pushed"+obj[key]);
            answers.push(obj[key])
          }

        }

    }
  }
  return answers

  }
  // console.log(answers);
