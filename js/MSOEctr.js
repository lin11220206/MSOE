var abcstr="$";
var Tstate=1; //0:A, 1:A  2:a  3:a'
var Dstate=5; //Mn, n=0~8. n=5 for N=1, n+1=>N*2, n-1=>N/2. 1n=N*(1+1/2), 2n=N*(1+1/2+1/4)... and so on
var CrtPos=0;
var abcjs=window.ABCJS;

var ttlstr="";
var chgttl = (a) => {
  ttlstr=a.value;
  print();
};
var tmpstr="";
var chgtmp = (a) => {
  if(a.value.length==2) a.value=a.value[0]+"/"+a.value[1];
  tmpstr=a.value;
  print();
}

var print = () => {
  abcjs.renderAbc('boo',"T: "+ttlstr+"\nM: "+tmpstr+"\nL: 1/4\n|"+rmsmb(abcstr),{},{add_classes:true, editable:true, listener:{highlight:(abcElem)=>{
      console.log(abcElem.startChar);
      var offset=abcElem.startChar-15-ttlstr.length-tmpstr.length;
      var ignsmbs=["$","#"];
      for(var i=0;i<abcstr.length;i++){
        if(!ignsmbs.includes(abcstr[i])){
          if(offset!=1){
            offset--;
          }else if(abcstr[i]!="["){
            CrtPos=i-1;
            return;
          }else{
            CrtPos=i-2;
            return;
          }
        }
      }
    }
  }});
};


var mvpos = (md) => {
	if(md==0){
		for(var i=CrtPos-1;i>=0;i--){
			if(abcstr[i]=="$"){
				return i;
			}
		}
	}
	if(md==1){
		for(var i=CrtPos+1;i<=abcstr.length;i++){
			if(abcstr[i]=="$"){
				return i;
			}
		}
	}
  if(md==2){
    for(var i=CrtPos-1;i>=0;i--){
      if(abcstr[i]=="\n"){
        for(var j=i-1;j>=0;j--){
          if(abcstr[j]=="$"){
            return j;
          }
        }
      }
    }
  }
  if(md==3){
    for(var i=CrtPos+1;i<=abcstr.length;i++){
      if(abcstr[i]=="\n"){
        for(var j=i+1;j<=abcstr.length;j++){
          if(abcstr[j]=="$"){
            return j;
          }
        }
      }
    }
  }
	return CrtPos;
};

var numtostr = (num) => {
  if(!Number.isInteger(num)){
    var Dnmntr=0;
    var Nmrtr=0;
    do{
      num*=2;
      Dnmntr++;
    }while(!Number.isInteger(num));
    Dnmntr=Math.pow(2,Dnmntr);
    Nmrtr=num;
    num=Nmrtr+"/"+Dnmntr;
  }
  if(num===1){
    num="";
  }
  return num;
};

var toabcnote = (ch) => {
  if(ch!="z"){
    switch(Tstate){
      case 0:
       ch=ch+",";
       break;
     case 3:
       ch=String.fromCharCode(ch.charCodeAt(0)+32)+"'";
       break;
     case 2:
       ch=String.fromCharCode(ch.charCodeAt(0)+32);
       break;
     default:
    }
  }
  /*
      (n-5)          1 (M+1)
  N = 2     x 2( 1-(---)    ), n=Dstate%10, M=Math.floor(Dstate/10).
                     2
  */
  ch=ch+numtostr(Math.pow(2,Dstate%10-4)*(1-Math.pow(1/2,Math.floor(Dstate/10)+1)));
  return ch;
};

var insert = (str,md) => {
  var InsBef=mvpos(1);
  if(InsBef!=CrtPos){
    if(abcstr[InsBef-1]=="\n")
      InsBef--;
    abcstr=abcstr.substring(0,InsBef)+(md!=1?"$":"")+str+abcstr.substring(InsBef);
  }else{
    abcstr=abcstr+(md!=1?"$":"")+str;
  }
  CrtPos=(md!=1)?mvpos(1):CrtPos;
  console.log(abcstr);
};

var insertch = (str) => {
  for(var i=mvpos(1)+2;i<abcstr.length;i++){
    if(abcstr[i]=="]"){
      abcstr=abcstr.substring(0,i)+str+abcstr.substring(i);
      return;
    }
  }
};

var rmsmb = (str) => {
  return str.replace(/[\\$]|[\\#]/g,"");
};


var checkinput = () => {
 let myArray = Array.from(document.getElementsByTagName("input"));
  if(myArray.includes(document.activeElement))
    return true;
  else
    return false;
}

var key = () => { // only keypress can tell if "shift" is pressed at the same time
  if(checkinput()) return;
	switch(event.keyCode){
		case 44:
				Dstate=(Dstate%10==0)?8:Dstate-1;
			break;
		case 46:
				Dstate=(Dstate%10==8)?0:Dstate+1;
			break;
		case 60:
			if((Math.floor(Dstate/10))!=0)
				Dstate=Dstate-10;
			break;
		case 62:
			Dstate=Dstate+10;
			break;
	// ----------Change Dstate-----------
    case 63: // for chord mode
		case 47:
			Tstate=(Tstate==3)?0:Tstate+1;
			break;
	// ----------Change Tstate-----------
		case 113:
      if((CrtPos!=0)&&(abcstr[CrtPos-1]!="\n")){
        var DelEnd=mvpos(1);
        var Latter="";
        if(DelEnd!=CrtPos){
          if(abcstr[DelEnd-1]=="\n")
            DelEnd--;
          Latter=abcstr.substring(DelEnd);
        }
        abcstr=abcstr.substring(0,CrtPos)+Latter;
        CrtPos=mvpos(0);
        console.log(CrtPos);
		  	console.log(abcstr);
      }
			break;
	// ----------Delete-----------------
    case 122:
      insert(toabcnote("C"),0);
      break;
    case 120:
      insert(toabcnote("D"),0);
      break;
    case 99:
      insert(toabcnote("E"),0);
      break;
    case 118:
      insert(toabcnote("F"),0);
      break;
    case 98:
      insert(toabcnote("G"),0);
      break;
    case 110:
      insert(toabcnote("A"),0);
      break;
    case 109:
      insert(toabcnote("B"),0);
      break;
  // ----------Insert Note------------
		case 97:
      if(abcstr[((mvpos(1)!=CrtPos)?mvpos(1):abcstr.length)-1]!=" ")
        insert(" ",1);
      break;
  // ----------Break Notes------------
    case 115:
      var RmBef=mvpos(1);
      if(abcstr[((RmBef!=CrtPos)?RmBef:abcstr.length)-1]==" "){
        if(RmBef==CrtPos){
          abcstr=abcstr.substring(0,abcstr.length-1);
        }else{
          abcstr=abcstr.substring(0,RmBef-1)+abcstr.substring(RmBef);
        }
      }
      break;
  // ----------Assemble Notes---------
    case 100:
      if(Dstate%10!=8){
        insert(toabcnote("z"),0);
      }else{
        alert("Pause with duration of 8 is illegal.");
      }
      break;
  // ----------Insert Pause-----------
    case 92:
      insert("|",0);
      break;
  // ----------Insert Bar-------------
    case 93: // ] : # 
      if(CrtPos!=0){
        if(abcstr[CrtPos+2]!="^"){
          if(abcstr[CrtPos+1]!="_"){
           abcstr=abcstr.substring(0,CrtPos+1)+"^"+abcstr.substring(CrtPos+1);
         }else{
           abcstr=abcstr.substring(0,CrtPos+1)+abcstr.substring(CrtPos+2);
         }
        }
      }
      break;
    case 91: // [ : b
      if(CrtPos!=0){
        if(abcstr[CrtPos+2]!="_"){
          if(abcstr[CrtPos+1]!="^"){
            abcstr=abcstr.substring(0,CrtPos+1)+"_"+abcstr.substring(CrtPos+1);
          }else{
            abcstr=abcstr.substring(0,CrtPos+1)+abcstr.substring(CrtPos+2);
         }
        }
      }
      break;
  // ----------Accidental-------------
    case 90:
      insertch(toabcnote("C"));
      break;
    case 88:
      insertch(toabcnote("D"));
      break;
    case 67:
      insertch(toabcnote("E"));
      break;
    case 86:
      insertch(toabcnote("F"));
      break;
    case 66:
      insertch(toabcnote("G"));
      break;
    case 78:
      insertch(toabcnote("A"));
      break;
    case 77:
      insertch(toabcnote("B"));
      break;
  // ----------Chord Mode-------------
    case 13:
      insert("\n$",1);
      CrtPos=mvpos(1);
      break;
  // ----------New Line---------------
    default:
	}
	console.log(Dstate);
	console.log(Tstate);
	console.log(event.keyCode);
  print();
};

var move = () => { // some keys can't be detected in keypress
  if(checkinput()) return;
	if(event.keyCode==37){
		CrtPos=mvpos(0);
	}
	if(event.keyCode==39){
		CrtPos=mvpos(1);
	}
  if(event.keyCode==38){
    CrtPos=mvpos(2);
  }
  if(event.keyCode==40){
    CrtPos=mvpos(3);
  }
  if(event.keyCode==8){
    var NxtPos=mvpos(0);
    if(abcstr[CrtPos-1]=="\n"){
      abcstr=abcstr.substring(0,CrtPos-1)+abcstr.substring(CrtPos+1);
      CrtPos=NxtPos;
    }
    print();
  }
  if(event.keyCode==16){
    var InsBef=mvpos(1);
    if((InsBef==CrtPos)||(abcstr[InsBef+1]!="[")){
      insert("$[]",1);
    }
  }
	console.log(CrtPos);
};

var chord = () => {
  if(checkinput()) return;
  if(event.keyCode==16){
    if(abcstr.substr(mvpos(1),3)==="$[]"){
      abcstr=abcstr.substring(0,mvpos(1))+abcstr.substring(mvpos(1)+3);
    }else{
      abcstr=abcstr.substring(0,mvpos(1)+1)+"#"+abcstr.substring(mvpos(1)+1);
      CrtPos=mvpos(1);
    }
  }
};

var btn = (a) => {
  insert(toabcnote(a.id),0);
  print();
};

window.onload = () => {
	print();
  document.onkeypress=key;
 	document.onkeydown=move;
  document.onkeyup=chord;
};