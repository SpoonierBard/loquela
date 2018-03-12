// let fs = require("fs");
let  model = {},
    input,
    currentPage = 0, //what page of the text are we on?
    pageRanges = []; //an array of 2-item arrays containing indeces of first and last words of the page
const colors  = ["#66c2a5", "#fc8d62", "#8da0cb"],
    scaledColors = ["hsl(161, 30%, 90%)", "hsl(17, 30%, 90%)", "hsl(222, 30%, 90%)", "hsl(70, 0%, 90%)", "hsl(161, 63%, 38%)", "hsl(17, 86%, 49%)", "hsl(222, 57%, 47%)", "hsl(70, 0%, 20%)"];


/**
 * Reloads main menu choice on button click; can be called from all other pages
 */
function reloadMainMenu(){
    document.getElementById("welcome-page").style.display = "block";
    document.getElementById("create-file-form").style.display = "none";
    document.getElementById("file-upload").style.display = "none";
    document.getElementById("tabs").style.display = "none";
    document.getElementById("json-file").value="";
    document.getElementById("json-file-label").innerText = "Browse";
    document.getElementById("an-text-body").innerHTML = "";
    $("#tabs").tabs("option", "active", 0);
    currentPage = 0;
    model = {};
}

/**
 * Transitions from welcome page to config file creation page on button click
 */
function loadConfigForm(){
    document.getElementById("welcome-page").style.display = "none";
    document.getElementById("create-file-form").style.display = "block";
}

/**
 * Transitions from welcome page to json file upload page on button click
 */
function loadFileChoice() {
    document.getElementById("welcome-page").style.display = "none";
    document.getElementById("file-upload").style.display = "block";
}

/**
 * Updates browse button with file name
 */
$(document).ready(function () {
    $("#json-file").change(function (e) {
        let fileName = '';
        if (e.target.value)
            fileName = e.target.value.split('\\').pop();
        if (fileName)
            document.getElementById("json-file-label").innerText = fileName;
        else
            document.getElementById("json-file-label").innerText = "Browse";
    });
});
/**
 * Creates a json file containing configuration parameters for LDA.py based on user choices
 */
function createConfigFile(){
    let englishStopwords = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards",
        "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also",
        "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone",
        "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't",
        "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "b", "be",
        "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being",
        "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by",
        "c", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "cause", "causes", "certain", "certainly",
        "changes", "clearly", "co", "com", "come", "comes", "concerning", "consequently", "consider", "considering",
        "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "d",
        "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't",
        "done", "down", "downwards", "during", "e", "each", "edu", "eg", "eight", "either", "else", "elsewhere",
        "enough", "entirely", "especially", "et", "etc", "even", "ever", "every", "everybody", "everyone",
        "everything", "everywhere", "ex", "exactly", "example", "except", "f", "far", "few", "fifth", "first", "five",
        "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further",
        "furthermore", "g", "get", "gets", "getting", "given", "gives", "go", "goes", "going", "gone", "got",
        "gotten", "greetings", "h", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't",
        "having", "he", "he's", "hello", "help", "hence", "her", "here", "here's", "hereafter", "hereby", "herein",
        "hereupon", "hers", "herself", "hi", "him", "himself", "his", "hither", "hopefully", "how", "howbeit",
        "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "inc",
        "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is",
        "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "j", "just", "k", "keep", "keeps", "kept", "know",
        "known", "knows", "l", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let",
        "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "m", "mainly", "many", "may",
        "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must",
        "my", "myself", "n", "name", "namely", "nd", "near", "nearly", "necessary", "need", "needs", "neither",
        "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally",
        "not", "nothing", "novel", "now", "nowhere", "o", "obviously", "of", "off", "often", "oh", "ok", "okay",
        "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our",
        "ours", "ourselves", "out", "outside", "over", "overall", "own", "p", "particular", "particularly", "per",
        "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite",
        "qv", "r", "rather", "rd", "re", "really", "reasonably", "regarding", "regardless", "regards", "relatively",
        "respectively", "right", "s", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see",
        "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious",
        "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some",
        "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon",
        "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t", "t's", "take",
        "taken", "tell", "tends", "th", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their",
        "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore",
        "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think",
        "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru",
        "thus", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying",
        "twice", "two", "u", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon",
        "us", "use", "used", "useful", "uses", "using", "usually", "uucp", "v", "value", "various", "very", "via",
        "viz", "vs", "w", "want", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome",
        "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where",
        "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which",
        "while", "whilst", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing",
        "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "y", "yes", "yet", "you",
        "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"],

        latinStopwords = ["ab", "ac", "ad", "adhic", "aliqui", "aliquis", "an", "ante", "apud", "at", "atque", "aut", "autem", "cum",
        "cur", "de", "deinde", "dum", "ego", "enim", "ergo", "es", "est", "et", "etiam", "etsi", "ex", "fio", "haud",
        "hic", "iam", "idem", "igitur", "ille", "in", "infra", "inter", "interim", "ipse", "is", "ita", "magis", "modo",
        "mox", "nam", "ne", "nec", "necque", "neque", "nisi", "non", "nos", "o", "ob", "per", "possum", "post", "pro",
        "quae", "quam", "quare", "qui", "quia", "quicumque", "quidem", "quilibet", "quis", "quisnam", "quisquam",
        "quisque", "quisquis", "quo", "quoniam", "sed", "si", "sic", "sive", "sub", "sui", "sum", "super", "suus",
        "tam", "tamen", "trans", "tu", "tum", "ubi", "uel", "uero", "unus", "ut"],

        bedeLatinStopwords = ["ab", "ac/1", "ad/2", "adhic", "aliqvi", "aliqvis", "an", "ante/2", "apvd", "at/2",
            "atqve", "avt", "avtem", "cvm/2", "cvm/1", "cvm/3", "cvr/1", "de", "deinde", "dum/2", "ego", "enim/2",
            "ergo", "es", "est", "et/2", "etiam", "etsi/2", "ex", "fio", "havd", "hic/1", "iam", "idem", "igitvr",
            "ille", "in", "infra/2", "inter", "interim", "ipse", "is", "ita", "magis/2", "modo/1", "mox", "nam",
            "ne/4", "nec", "necqve", "neqve", "nisi", "non", "nos", "o", "ob", "per", "possvm/1", "post/2", "pro/1",
            "qvae", "qvam/1", "qvare/1", "qvi/1", "qvi/2","quia", "qvicvmqve/1", "qvidem", "qvilibet", "qvis/1",
            "qvisnam", "qvisquam", "qvisqve/2", "qvisqvis/2", "qvo", "qvoniam", "sed", "si/2", "sic", "sive/1", "svb",
            "svi/1", "svm/1", "svper/2", "suus", "tam", "tamen", "trans/2", "tv", "tvm", "vbi/1", "vel/1", "vero/2",
            "vero/3", "vnvs", "vt/4", "#n/a"],

        source = document.getElementById("create-file-source").value,
        iterations = parseInt(document.getElementById("create-file-iterations").value),
        topics = parseInt(document.getElementById("create-file-topics").value),
        outputname = document.getElementById("create-file-output").value,
        upperlimit = parseInt(document.getElementById("create-file-upperlimit").value) / 100,
        lowerlimit = parseInt(document.getElementById("create-file-lowerlimit").value) / 100,
        whitelist = document.getElementById("create-file-whitelist").value.split(",").map(x => x.trim()),
        blacklist = document.getElementById("create-file-blacklist").value.split(",").map(x => x.trim()),
        numberofdocuments,
        lengthofdocuments,
        splitstring,
        usingcsv,
        alpha = parseFloat(document.getElementById("create-file-alpha").value),
        beta = parseFloat(document.getElementById("create-file-beta").value);

    if (document.getElementById("create-file-default-english-stopwords").value === "true"){
        blacklist.push.apply(blacklist, englishStopwords);
    }
    if (document.getElementById("create-file-default-latin-stopwords").value === "true"){
        blacklist.push.apply(blacklist, latinStopwords);
    }
    if (document.getElementById("create-file-default-bede-stopwords").value === "true"){
        blacklist.push.apply(blacklist, bedeLatinStopwords);
    }

    if(document.getElementById("chunking-number").checked) {
        numberofdocuments = parseInt(document.getElementById("create-file-number-documents").value);
        lengthofdocuments = "off";
        splitstring = "off";
        usingcsv = "off";
    } else if (document.getElementById("chunking-length").checked) {
        numberofdocuments = "off";
        lengthofdocuments = parseInt(document.getElementById("create-file-length-documents").value);
        splitstring = "off";
        usingcsv = "off";
    } else if (document.getElementById("chunking-splitstring").checked) {
        numberofdocuments = "off";
        lengthofdocuments = "off";
        splitstring = document.getElementById("create-file-split-string").value;
        usingcsv = "off";
    } else if (document.getElementById("chunking-csv").checked) {
        numberofdocuments = "off";
        lengthofdocuments = "off";
        splitstring = "off";
        usingcsv = "on";
    }

    let config = {}, reqparam = {}, stoptions = {}, choptions = {}, hyperparameters = {};
    reqparam["source"] = source;
    reqparam["iterations"] = iterations;
    reqparam["topics"] = topics;
    reqparam["output name"] = outputname;
    stoptions["upper limit"] = upperlimit;
    stoptions["lower limit"] = lowerlimit;
    stoptions["whitelist"] = whitelist;
    stoptions["blacklist"] = blacklist;
    choptions["number of documents"] = numberofdocuments;
    choptions["length of documents"] = lengthofdocuments;
    choptions["split string"] = splitstring;
    choptions["using csv"] = usingcsv;
    hyperparameters["alpha"] = alpha;
    hyperparameters["beta"] = beta;

    config["required parameters"] = reqparam;
    config["stopword options"] = stoptions;
    config["chunking options"] = choptions;
    config["hyperparameters"] = hyperparameters;

    let filename = "./" + outputname + "-config.json";
    fs.writeFile(filename, JSON.stringify(config), (err) => {
        if (err) {
            console.error(err);
        }
    });
    reloadMainMenu();
}

/**
 * Reads model data from json file output from LDA.py
 */
//Function to read data from uploaded json file. Called on button click.
function loadFile() {
    let reader;
    reader = new FileReader();
    input = document.getElementById("json-file");
    if (!input.files[0]) {
        alert("Please select a file before clicking upload");
    } else if (input.files[0].name.split('.').pop().toLowerCase() !== "json"){
        document.getElementById("json-file").value="";
        document.getElementById("json-file-label").innerText = "Browse";
        alert("Please select a JSON file")
    } else {
        hideUploadScreen();
        reader.onload = (function() {
            model = JSON.parse(reader.result);
            if (model["dataset"] === undefined ||
                model["topics"] === undefined ||
                model["iterations"] === undefined ||
                model["alpha"] === undefined ||
                model["beta"] === undefined ||
                model["wordsByLocationsWithStopwords"] === null ||
                model["topicsByLocationWithStopwords"] === null ||
                model["topicWordInstancesDict"] === null ||
                model["stopwords"] === null ||
                model["puncAndCap"] === null ||
                model["puncCapLocations"] === null ||
                model["newlineLocations"] === null) {
                    document.getElementById("file-upload").style.display = "block";
                    document.getElementById("progressbar").style.display = "none";
                    document.getElementById("json-file").value="";
                    document.getElementById("json-file-label").innerText = "Browse";
                    alert("Please upload a correctly formatted JSON file")
            } else {
                createMetadata();
                initializeHeatmaps();
                createAnnotatedText();
                initializeWordCloudTab();
                loadTabs();
            }
        });
        reader.readAsText(input.files[0]);
    }
}

/**
 * Transitions from json file upload page to progress bar
 */
function hideUploadScreen() {
    document.getElementById("file-upload").style.display = "none";
    document.getElementById("progressbar").style.display = "block";
}

/**
 * Applies JQuery-UI styling and functionality to progress bar
 */
$(function() {
    $( "#progressbar" ).progressbar({
        value: false
    });
});

/**
 * Transitions from progress bar to tabs once they have finished loading
 */
function loadTabs() {
    document.getElementById("progressbar").style.display = "none";
    document.getElementById("tabs").style.display = "block";
}

/**
 * Applies JQuery-UI styling and functionality to tabs
 */
$( function() {
    $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" )
        .find("li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
} );


//METADATA TAB

/**
 * Resizes the topic preview portion of the metadata tab based on window size
 */
function resizeMetadata() {
    let metadataWidth = window.innerWidth - 220,
        metadataHeight = window.innerHeight - 400;
    $("#metadata-topic-preview-text")
        .height(metadataHeight)
        .width(metadataWidth);
}

/**
 * Loads data into metadata tab
 */
function createMetadata(){
    document.getElementById("dataset").innerHTML = model["dataset"];
    document.getElementById("topics").innerHTML = model["topics"];
    document.getElementById("iterations").innerHTML = model["iterations"];
    document.getElementById("alpha").innerHTML = model["alpha"];
    document.getElementById("beta").innerHTML = model["beta"];
    
    document.getElementById("stopwords-dialog").innerHTML = "<p>" + model.stopwords.join(", ") + "</p>";

    resizeMetadata();

    //create nicknames data structure
    if (model["nicknames"] === null || model["nicknames"] === undefined) {
        model["nicknames"] = [];
        for (let i = 0; i < model.topicWordInstancesDict.length; i++) {
            model.nicknames.push("Topic " + (i + 1));
        }
    }
    //dynamically create injectable HTML with dropdown options for each topic
    let topicDropdownHTMLmetadata = "";

    for (let i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTMLmetadata = topicDropdownHTMLmetadata + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">" + model.nicknames[i] + "</option>";
    }
    document.getElementById("metadata-topic-select").innerHTML = topicDropdownHTMLmetadata;
    $('#metadata-topic-select').find('option')[0].selected = true;

    let topicWordList = Object.keys(model.topicWordInstancesDict[0]);
    topicWordList = topicWordList.sort(function (a, b) {
        return model.topicWordInstancesDict[0][b] -
            model.topicWordInstancesDict[0][a];
    });
    document.getElementById("metadata-topic-preview-text").textContent = topicWordList.join(", ");
}

/**
 * Writes model data including new nicknames to original json file
 */
function saveNicknames() {
    fs.writeFile(input.files[0].path, JSON.stringify(model), (err) => {
        if (err) {
            console.error(err);
        }
    });
}

/**
 * Loads new topic in metadata tab on dropdown change
 */
$(document).ready(function() {
    $("#metadata-topic-select").change(function () {
        let value = $("#metadata-topic-select").find("option:selected").val();
        value = parseInt(value);
        let topicWordList = Object.keys(model.topicWordInstancesDict[value]);
        topicWordList = topicWordList.sort(function (a, b) {
            return model.topicWordInstancesDict[value][b] -
                model.topicWordInstancesDict[value][a];
        });
        document.getElementById("metadata-topic-preview-text").textContent = topicWordList.join(", ");
    });
});

//Metadata popup/Dialog setup

/**
 * Initializes stopwords dialog
 */
$( function() {
    let dialog = $( "#stopwords-dialog");
    dialog.dialog({
            open: function() {$("#ui-id-5").css("background-color", "transparent")},
            title: "Stopwords",
            autoOpen: false,
            height: 400,
            draggable: false,
            modal: true,
            width: 350,
            overflow: scroll
        }
    );

    $( "#view-stopwords").button().on( "click", function() {
        dialog.dialog("open");
    });
});

/**
 * Initializes nickname selection dialog
 */
$( function() {
    let dialog, form,
        topic = $("#metadata-topic-select"),
        nickname = $("#nickname-input");
    dialog = $( "#nickname-dialog-form" ).dialog({
        open: function() {$("#ui-id-6").css("background-color", "transparent")},
        title: "Nickname",
        autoOpen: false,
        height: 250,
        width: 350,
        draggable: false,
        modal: true,
        buttons: {
            Cancel: function() {
                dialog.dialog( "close");
            },
            "Nickname topic": addNickname
        },
        close: function() {
            form[ 0 ].reset();
        }
    });

    form = dialog.find( "form" ).on( "submit", function (event) {
        event.preventDefault();
        addNickname();
    });

    $( "#create-nickname").button().on( "click", function() {
        dialog.dialog("open");
        let topic = parseInt($("#metadata-topic-select").find("option:selected").val());
        document.getElementById("nickname-input").placeholder = model.nicknames[topic];
    });

    function addNickname() {
        if ($.trim(nickname.val()).length > 0)  {
            model.nicknames[topic.val()] = nickname.val();
            let toUpdate = document.getElementsByClassName("select-topic-" + topic.val());
            for (let i = 0; i < toUpdate.length; i++){
                toUpdate[i].innerText = model.nicknames[topic.val()];
            }
        }
        dialog.dialog("close");
    }
});

//ANNOTATED TEXT TAB

/**
 * Resizes the text preview portion of the annotated text tab based on window size
 */
function resizeAnnotatedText() {
    let textWidth = window.innerWidth - 300,
        textHeight = window.innerHeight - 320;

    $("#an-text-body")
        .height(textHeight)
        .width(textWidth);
}

/**
 * Initializes annotated text tab with no topics selected
 */

function createAnnotatedText() {
    pageRanges = indexByPage();
    let topicDropdownHTML = "<option selected value = \"-2\">Select Topic</option>";
    let topicDropdownHTMLScroll = "<option disabled selected value = \"-2\">Select Topic</option>";

    resizeAnnotatedText();

    //create three identical selectors for three possible topic comparisons
    for (let i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTML = topicDropdownHTML + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">" + model.nicknames[i] + "</option>";
        topicDropdownHTMLScroll = topicDropdownHTMLScroll + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">" + model.nicknames[i] + "</option>";
    }
    document.getElementById("an-text-topic-select-1").innerHTML = topicDropdownHTML;
    document.getElementById("an-text-topic-select-2").innerHTML = topicDropdownHTML;
    document.getElementById("an-text-topic-select-3").innerHTML = topicDropdownHTML;
    document.getElementById("an-text-scrollbar-select").innerHTML = topicDropdownHTMLScroll;
    $('#an-text-scrollbar-select').find('option')[1].selected = true;
    replaceHeatmap(4, 0);

    for (let i = 1; i < 4; i++) {
        d3.select("#an-text-topic-select-" + i)
            .style("background", function () {
                return colors[i - 1];
            });
    }
    d3.select("#an-text-body")
        .attr("height", function() {
            return document.getElementById("heatmapSVG4").height
        });
    loadAnnotatedText(0);

    //if "Enter" presssed in jumpNum input box, click on jumpTrigger button
    $("#jumpNum").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#jumpTrigger").click();
        }
    });
}

/**
 * Loads the current page of the text in to the annotated text body
 */
function loadAnnotatedText() {
    //removes currently loaded text
    d3.select("#an-text-body").selectAll("span").remove();

    let startIndex = pageRanges[currentPage][0],
        endIndex = pageRanges[currentPage][1],
        puncTracker = 0, //index of punctuation
        puncLocation = 0, //index of puncLocation
        puncLocTracker = 0, //where in text
        newlineTracker = 0, //index of newlines
        startTracker = 1, //track how far into text we are
        newlineSetback = 0,
        wordToApp;

    //iterate over all words
    for (let docInText in model.wordsByLocationWithStopwords) {
        for (let word in model.wordsByLocationWithStopwords[docInText]) {

            wordToApp = model.wordsByLocationWithStopwords[docInText][word];

            //if word originally had punctuation or capitalization, prepare its punctuated / capitalized form
            if (puncLocTracker === model.puncCapLocations[puncLocation]) {
                wordToApp = model.puncAndCap[puncTracker];
                puncTracker += 1;
                puncLocation += 1;
            }
            //if word originally had newlines after it, add them to the prepared word
            while (puncLocTracker + newlineSetback === model.newlineLocations[newlineTracker]) {
                wordToApp += '<br/>';
                newlineTracker += 1;
            }
            //if there is punctuation without a word attached, add it to the prepared word
            while (puncLocTracker == model.puncCapLocations[puncLocation] - 0.5) {
                wordToApp += (' ' + model.puncAndCap[puncTracker]);
                puncTracker += 1;
                puncLocation += 1;
                newlineSetback += 1;
            }
            //check for newlines again after loading that punctuation
            while (puncLocTracker + newlineSetback === model.newlineLocations[newlineTracker]) {
                wordToApp += '<br/>';
                newlineTracker += 1;
            }
            puncLocTracker += 1;

            //if the prepared word is in the indices of the current page, load it in
            if (startIndex <= startTracker && startTracker <= endIndex) {
                d3.select("#an-text-body")
                    .append("span")
                    .html(wordToApp)
                    .attr("class", "topic-" + model.topicsByLocationWithStopwords[docInText][word])
                    //value = 1 if span is a selected topic, 0 otherwise
                    .attr("value", 0)
                    .on("mouseover", onHover)
                    .on("mouseout", offHover)
                    //clicking on selected span triggers a jump to the heatmap
                    .on("click", function () {
                        if (parseInt(d3.select(this).attr("value")) === 1) {
                            jumpToHeatmap();
                        }
                    });
                d3.select('#an-text-body')
                    .append("span")
                    .text(" ");
            }
            startTracker += 1;
        }
    }
    //update page number indicator
    document.getElementById("page-number").innerText = ("Page " + (currentPage + 1) + " of " + (pageRanges.length));
    if (document.getElementById("an-text-body").scrollTop > 20){
        document.getElementById("an-text-body").scrollTop = 0;
    }

    //select correct scrollbar rectangle
    let getRekt = "#rect-"+currentPage;
    replaceHeatmap(4, heatmap4Topic);
    d3.select(getRekt)
        .style("fill", "red")
        .attr("x", 0)
        .attr("width", 40);

    //make sure all topics get selected as necessary
    onAnTextTopicSelect();
}


/**
 * Displays tooltip of topic for word on hover; highlights other words in topic if check-highlight is checked
 */
function onHover() {
    d3.select(this)
        .attr("data-tooltip", function(){
            let topicindex = parseInt(this.className.split("-")[1]);
            if (this.className.split("-").length > 2) {
                return "stopword";
            }
            else if (model.nicknames[topicindex] !== "") {
                return model.nicknames[topicindex];
            } /*else {
                return "topic-" + (topicindex + 1);
            }*/
        });
    let topic = "." + this.className,
        selectedOne = "topic-" + document.getElementById("an-text-topic-select-1").value,
        selectedTwo = "topic-" + document.getElementById("an-text-topic-select-2").value,
        selectedThree = "topic-" + document.getElementById("an-text-topic-select-3").value;
    //check to make sure we don't overwrite a selected topic
    if ((selectedOne !== this.className) && (selectedTwo !== this.className) && (selectedThree !== this.className)) {
        //only apply if hover on highlight is checked
        if (document.getElementById("check-highlight").checked && this.className !== "topic--1") {
            d3.selectAll(topic)
                .style("background-color", "yellow")
        }
    }
}

/**
 * Unhighlights previously highlighted words when the mouse stops hovering over a word
 */
function offHover() {
    let topic = "." + this.className,
        selectedOne = "topic-" + document.getElementById("an-text-topic-select-1").value,
        selectedTwo = "topic-" + document.getElementById("an-text-topic-select-2").value,
        selectedThree = "topic-" + document.getElementById("an-text-topic-select-3").value;
    if ((selectedOne !== this.className) && (selectedTwo !== this.className) && (selectedThree !== this.className)) {
        d3.selectAll(topic)
            .style("background-color", "white");
    }
}

/**
 * Highlights all words in selected topic with the corresponding color of the dropdown
 */
function onAnTextTopicSelect() {
    //reset all spans to unselected
    d3.selectAll("span")
        .style("background-color", "white")
        .attr("value",0)
        .style("cursor", "text");

    //iterate through selectors and change background color for all spans with the corresponding class name
    for (let i = 0; i < 3; i++) {
        let selector = "an-text-topic-select-" + (i + 1);
        let topic = ".topic-" + document.getElementById(selector).value;
        d3.selectAll(topic)
            .attr("value", 1)
            .style("background-color", function() { return colors[i]; })
            .style("cursor", "pointer");
    }
}

/**
 * Propagates topic selections in heatMap tab to anText tab
 */
function propagateDropdownChange() {
    for (let j = 1; j < 4; j++) {
        let menuName = "heatmap" + j + "Menu";
        let topicSelected = parseInt(document.getElementById(menuName).value);
        let selector = "#an-text-topic-select-" + j;
        $(selector).val(topicSelected).change();
    }
}

/**
 * On clicking a selected span in annotated text, switch to heat map tab with same topics selected
 * If annotated text has unselected topics, use default values for the corresponding heatmap
 */
function jumpToHeatmap() {
    let topicNum;
    for(let i = 1; i < 4; i++) {
        if(document.getElementById("an-text-topic-select-" + i).value >= 0) {
            topicNum = document.getElementById("an-text-topic-select-" + i).value;
        } else {
            topicNum = i - 1;
        }
        replaceHeatmap(i, topicNum);
        $('#heatmap' + i + 'Menu').val(topicNum);
    }
    $("#tabs").tabs("option", "active", 1);

    //add indicator in heatMap for position in annotatedText that we jumped from
    let jumpedRect = ".rect-"  + currentPage;
    d3.selectAll(jumpedRect)
        .style("fill", "black");
    //delay and then remove indicator
    window.setTimeout(replaceAllHeatmaps, 2000);
}

/**
* Overwrites every heatmap
*/
function replaceAllHeatmaps() {
    for (let i = 1; i < 4; i++) {
        let topicNum = document.getElementById("heatmap" + i + "Menu").value;
        replaceHeatmap(i, topicNum);
    }
}

/**
 * Calculates the word ranges for each page and saves them to pageRanges
 * @return {number[][]} binnedPages -- array of 2-element arrays representing each page by its first and last index
 */
function indexByPage() {
    let binnedPages = [],
        curPage = [-1,-1],
        totalLength = 0,
        locTracker = 0;
    for (let i = 0; i < model.wordsByLocationWithStopwords.length; i++) {
        totalLength += model.wordsByLocationWithStopwords[i].length;
    }
    let binSize = Math.floor(totalLength/(heatmapWidthPx/heatmapResPx)),
        countDown = binSize;
    for (let i = 0; i < model.wordsByLocationWithStopwords.length; i++) {
        for (let j = 0; j < model.wordsByLocationWithStopwords[i].length; j++) {
            countDown--;
            locTracker++;
            if (curPage[0] === -1) {
                curPage[0] = locTracker;
            } else {
                curPage[1] = locTracker;
            }
            //as long as the page is not the last page, make the page binSize words long and save it
            if ((countDown<=0) && (totalLength - locTracker > binSize) /*&& (locTracker === model.newlineLocations[newlineTracker])*/)  {
                countDown = binSize;
                binnedPages.push(curPage);
                curPage = [-1, -1];
            }
            //if the page is the last page, wait until all remaining words have been added to it before saving its ranges
            else if (locTracker === totalLength){
                binnedPages.push(curPage);
            }
        }
    }
    return binnedPages;
}


//HEATMAP TAB

let prevalenceArray = [], //this is an array that counts the number of topic words in a bin
    heatmapWidthPx = 500, //this is the total width of the heatmap bar as a whole
    heatmapResPx = 1, //this is the width of each individual rect making up the heatmap
    heatmapSmoothing = 10,
    heatmap1Topic,//this is how intense the smoothing applied to the heatmap is
    heatmap2Topic,
    heatmap3Topic,
    heatmap4Topic;



$(document).ready(function() {
    /**
     * Reloads heatmap on corresponding dropdown change
     */
    $( "#heatmap1Menu" ).change(function () {
        replaceHeatmap(1, $("#heatmap1Menu").find("option:selected").val());
    });
    $( "#heatmap2Menu" ).change(function () {
        replaceHeatmap(2, $("#heatmap2Menu").find("option:selected").val());
    });
    $( "#heatmap3Menu" ).change(function () {
        replaceHeatmap(3, $("#heatmap3Menu").find("option:selected").val());
    });
    $( "#an-text-scrollbar-select" ).change(function () {
        replaceHeatmap(4, $("#an-text-scrollbar-select").find("option:selected").val());
        d3.select("#rect-" + currentPage)
            .style("fill", "red")
            .attr("x", 0)
            .attr("width", 40);
    });
    /**
     * Reloads heatmaps taking into account whether a smoothing constant is being applied on checkbox change
     */
    $("#smoothingBox").change(
        function(){
            if ($(this).is(':checked')) {
                heatmapSmoothing = parseInt($("#smoothingSelect").val());
                replaceHeatmap(1,heatmap1Topic);
                replaceHeatmap(2,heatmap2Topic);
                replaceHeatmap(3,heatmap3Topic);
            }
            else {
                heatmapSmoothing = 1;
                replaceHeatmap(1,heatmap1Topic);
                replaceHeatmap(2,heatmap2Topic);
                replaceHeatmap(3,heatmap3Topic);
            }
        });
    /**
     * Reloads heatmaps taking into account the new smoothing constant on dropdown change
     */
    $("#smoothingSelect").change(function () {
        if ($("#smoothingBox").is(':checked')) {
            heatmapSmoothing = parseInt($("#smoothingSelect").val());
            replaceHeatmap(1, heatmap1Topic);
            replaceHeatmap(2, heatmap2Topic);
            replaceHeatmap(3, heatmap3Topic);
        }
    });
});

/**
 * Creates an array representing the distribution of a particular topic across corpus
 * @param {number} topic -- topic whose distribution array will represent
 * @returns {number[]} -- array representing topic distribution across corpus
 */
function createPrevalenceArray(topic) {

    //create 2D array representing the corpus, each element is 1 if the corresponding word is in the topic, 0 otherwise
    let innerArray = [];
    for (let i = 0; i < model.wordsByLocationWithStopwords.length; i++) {
        for (let j = 0; j < model.wordsByLocationWithStopwords[i].length; j++) {
            if (model.topicsByLocationWithStopwords[i][j] === parseInt(topic)) {
                innerArray.push(1);
            } else {
                innerArray.push(0);
            }
        }
        prevalenceArray.push(innerArray);
        innerArray = [];
    }

    //separate the values into heatmapWidthPx/heatmapResPx bins, each of which is the sum of the values it contains
    let binnedArray = [0],
        totalLength = 0;
    for (let i = 0; i < prevalenceArray.length; i++) {
        totalLength += prevalenceArray[i].length;
    }
    let binSize = Math.floor(totalLength/(heatmapWidthPx/heatmapResPx)),
        countDown = binSize,
        curIndex = 0;
    for (let i = 0; i < prevalenceArray.length; i++) {
        for (let j = 0; j < prevalenceArray[i].length; j++) {
            countDown--;
            binnedArray[curIndex] += prevalenceArray[i][j];

            if (countDown<=0) {
                countDown = binSize;
                curIndex++;
                binnedArray.push(0);
            }
        }
    }
    prevalenceArray = [];
    return binnedArray;
}

/**
 * Creates an array with smoother prevalence transitions from an original array
 * @param {number[]} originalArray -- array to be smoothed
 * @param {number} smoothingRadius -- amount of smoothing
 * @returns {number[]} -- array after smoothing
 */
function smoothArray(originalArray, smoothingRadius) {
    let smoothedArray =
        Array.apply(null, Array(originalArray.length)).map(Number.prototype.valueOf,0);
    for (let i = 0; i < originalArray.length; i++) {
        if (originalArray[i] !== 0) {
            for (let j = (i - smoothingRadius + 1); j < i + smoothingRadius; j++) {
                if ((j >= 0) && (j <= i)) {
                    smoothedArray[j] +=
                        originalArray[i]*(smoothingRadius - (i - j));
                }
                if ((j > i)&&(j < originalArray.length)) {
                    smoothedArray[j] +=
                        originalArray[i]*(smoothingRadius + (i - j));
                }
            }
        }
    }
    return smoothedArray;
}

/**
 * Initializes heatmap tab
 */
function initializeHeatmaps() {

    let topicDropdownHTML = "<option disabled>Select Topic</option>";
    for (let i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTML = topicDropdownHTML + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">" + model.nicknames[i] + "</option>";
    }
    document.getElementById("heatmap1Menu").innerHTML = topicDropdownHTML;
    $('#heatmap1Menu').find('option')[1].selected = true;
    document.getElementById("heatmap2Menu").innerHTML = topicDropdownHTML;
    $('#heatmap2Menu').find('option')[2].selected = true;
    document.getElementById("heatmap3Menu").innerHTML = topicDropdownHTML;
    $('#heatmap3Menu').find('option')[3].selected = true;
    replaceHeatmap(1,0);
    replaceHeatmap(2,1);
    replaceHeatmap(3,2);
    replaceHeatmap(4, 0);

    for (let iter = 1; iter < 5; iter++){
        let topic = eval("heatmap" + iter + "Topic");

        let svg = d3.select("#heatmapSVG" + iter);

        if (iter === 4) {
            svg.style("height", function(){
                return heatmapWidthPx*1.5 + "px"
            });
            svg.style("width", 50)
        } else {
            svg.style("width", function () {
                return heatmapWidthPx * 1.5 + "px"
            });
            svg.style("height", 60);
            changeTop5Words(iter, (iter - 1));
        }

        let binnedArray = createPrevalenceArray(topic);
        binnedArray = smoothArray(binnedArray, heatmapSmoothing);

        drawRectangles(svg, binnedArray, iter);
    }
}

/**
 * Reloads top 5 words of topic
 * @param {number} heatmapNum -- which heatmap to update
 * @param {number} topic -- which topic to load
 */
function changeTop5Words(heatmapNum, topic) {
    let topicWords = Object.keys(model.topicWordInstancesDict[topic]),
        sortedWords = topicWords.sort(function(a,b){
        return model.topicWordInstancesDict[topic][b] - model.topicWordInstancesDict[topic][a];
    });
    let top5Words = ": ";
    for (let j = 0; j < 4; j++) {
        top5Words = top5Words + sortedWords[j] + ", ";
    }
    top5Words = top5Words + sortedWords[4];
    d3.select("#topicLabel" + heatmapNum).text(top5Words)
}

/**
 * Draws rectangles representing the values in an array
 * @param svg -- where to draw the rectangles
 * @param {number[]} dataset -- array representing topic distribution
 * @param {number} heatmapNum -- which heatmap to draw the rectangles in
 */
function drawRectangles(svg, dataset, heatmapNum) {
    let colorScale = d3.scaleLinear()
        .domain([d3.min(dataset),
            d3.max(dataset)])
        .range([scaledColors[heatmapNum - 1], scaledColors[heatmapNum + 3]]);
    eval("heatmap" + heatmapNum + "ColorScale = colorScale;");
    //annotated text scrollbar
    if (heatmapNum === 4) {
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("height", function() {return heatmapResPx})
            .attr("width", 30)
            .attr("x", 5)
            .attr("y", function(d,i) {return i * heatmapResPx})
            .attr("data-tooltip", function() {
                let assocPage = parseInt(d3.select(this).attr("y")) + 1;
                return "Page " + assocPage;
            })
            .attr("id", function(d,i) {return "rect-"+i})
            .style("fill", function(d) {return colorScale(d);})
            .on("mouseover", function(d){
                if (d3.select(this).style("fill") !== "red"){
                    d3.select(this)
                        .style("fill", "black")
                        .attr("x", 0)
                        .attr("width", 40)
                }
            })
            .on("mouseout", function(d){
                if (d3.select(this).style("fill") !== "red") {
                    d3.select(this)
                        .style("fill", function(d) {return colorScale(d);})
                        .attr("x", 5)
                        .attr("width", 30)
            }})
            .on("click", function(d, i){
                currentPage = i;
                if (currentPage >= 500) {
                    currentPage--;
                }
                svg.selectAll("rect")
                    .style("fill", function(d) {return colorScale(d);})
                    .attr("width", 30)
                    .attr("x", 5);
                d3.select(this)
                    .style("fill", "red")
                    .attr("width", 40)
                    .attr("x", 0);
                loadAnnotatedText(currentPage);
            })
    }
    //heatmaps on heatmap tab
    else {
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("width", function () {
                return heatmapResPx
            })
            .attr("height", 50)
            .attr("y", 5)
            .attr("x", function (d, i) {
                return i * heatmapResPx
            })
            .attr("class", function(d,i) {return "rect-" + i; })
            .attr("id", function(d,i) {return "rect-" + i + "-" + heatmapNum; })
            .attr("data-tooltip", function() {
                let assocPage = parseInt(d3.select(this).attr("y")) + 1;
                return "Page " + assocPage;
            })
            .style("fill", function (d) {
                return colorScale(d);
            })
            .on("mouseover", function (d) {
                let rectClass = this.getAttribute("class");
                let classSelector = "." + rectClass;
                d3.selectAll(classSelector)
                //d3.select(this)
                    .style("fill", "black")
                    .attr("height", 60)
                    .attr("y", 0)
                
            })
            .on("mouseout", function () {
                //TODO: change color-scaling to take heatMap as param
                // replaceAllHeatmaps();
                let className = this.getAttribute("class");
                d3.selectAll("." + className)
                    .attr("height", 50)
                    .attr("y", 5);
                for (let n = 1; n < 4; n++){
                    d3.select("#" + className + "-" + n).style("fill", function (d) {
                        return eval("heatmap" + n + "ColorScale")(d);
                    })
                }
            })
            .on("click", function (d, i) {
                $("#tabs").tabs("option", "active", 2);
                propagateDropdownChange();
                currentPage = i;
                loadAnnotatedText(i);
            })
    }
}

/**
 * Reloads a given heatmap with a new topic
 * @param {number} heatmapNum -- which heatmap to update
 * @param {number} topic -- which topic to load
 */
function replaceHeatmap(heatmapNum, topic) {
    let svg = d3.select("#heatmapSVG" + heatmapNum);
    svg.html("");
    switch(heatmapNum) {
        case 1:
            heatmap1Topic = topic;
            break;
        case 2:
            heatmap2Topic = topic;
            break;
        case 3:
            heatmap3Topic = topic;
            break;
        case 4:
            heatmap4Topic = topic;
            break;
        default:
            break;
    }
    let heatmapArray = createPrevalenceArray(topic);
    if(heatmapNum < 4) {
        heatmapArray = smoothArray(heatmapArray, heatmapSmoothing);
        changeTop5Words(heatmapNum, topic);
    }
    drawRectangles(svg, heatmapArray, heatmapNum);
}

/**
 * Decrements current page and reloads annotated text, never going below 0
 */
function pageLeft() {
    currentPage--;
    if (currentPage < 0) {
        currentPage = 0;
    }
    loadAnnotatedText(currentPage);
}

/**
 * Increments current page and reloads annotated text, never going beyond last page
 */
function pageRight() {
    currentPage++;
    if (currentPage > (pageRanges.length - 1)) {
        currentPage = pageRanges.length - 1;
    }
    loadAnnotatedText(currentPage);
}

/**
 * Checks that page number input is in defined page range, updates current page, and reloads text
 */
function jumpPage() {
    let newPage = parseInt(document.getElementById("jumpNum").value);
    if (0 < newPage && newPage <= pageRanges.length) {
        currentPage = parseInt(document.getElementById("jumpNum").value) - 1;
        loadAnnotatedText(currentPage);
    } else {
        let errorMessage = "Please input a number between 1 and " + (pageRanges.length) + ".";
        alert(errorMessage);
    }
}


//WORD CLOUD TAB

/**
 * Intializes word cloud tab with Topic 1 selected
 */
function initializeWordCloudTab() {
    let topicDropdownHTMLWordCloud = "<option disabled selected='selected' value='-1'>Select topic for wordcloud</option>";
    for (let i = 0; i < model.topicWordInstancesDict.length; i++) {
        topicDropdownHTMLWordCloud = topicDropdownHTMLWordCloud + "<option class=\"select-topic-" + i + "\" value=\"" + i + "\">" + model.nicknames[i] + "</option>";
    }
    let sizeDropdownHTMLWordCloud = "<option disabled selected='selected' value='-1'>Select wordcloud size</option>",
        sizeArray = ["Small", "Medium", "Large"];
    for (let i = 0; i < sizeArray.length; i++) {
        size = sizeArray[i];
        sizeDropdownHTMLWordCloud = sizeDropdownHTMLWordCloud + "<option class=\select-size-" + i + "\" value=\"" + i + "\">" + size + "</option>"
    }
    document.getElementById("word-cloud-topic-select").innerHTML = topicDropdownHTMLWordCloud;
    let width = window.innerWidth - 230;
    let height = window.innerHeight - 170;
    createWordCloud(0, width, height);
}

/**
 * Reloads word cloud based on a new topic
 * @param {number} topicNum -- topic to be displayed
 * @param {number} width -- new width of word cloud
 * @param {number} height -- new height of word cloud
 */
function createWordCloud(topicNum, width, height) {
    $("#word-cloud").empty();
    let svg_location = "#word-cloud";
    let word_entries = model.topicWordInstancesDict[topicNum];

    //filtered_entries contains every element of word_entries with a count greater than 1
    let reduced_entries = d3.entries(Object.keys(word_entries).reduce(function (new_dict, key) {
        if (word_entries[key] > 1 && key.length > 2) new_dict[key] = word_entries[key];
        return new_dict;
    }, {}));

    let fill = d3.schemeCategory20;
    let size = width * height;
    let len = reduced_entries.length;
    const mid = (size >= 250000 && len >= 200);
    const large = (size >= 600000 && len >= 350);
    const biggest = (size >= 1000000 && len >= 450);
    if (mid) fill = fill.concat(d3.schemeCategory10);
    if (large) fill = fill.concat(d3.schemeCategory20c);
    if (biggest) fill = fill.concat(d3.schemeCategory20b);
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(reduced_entries, function(d) {
            return d.value;
        })
        ])
        .range([10,100]);
    d3.layout.cloud()
        .size([width, height])
        .timeInterval(20)
        .words(reduced_entries)
        .fontSize(function(d) { return xScale(+d.value); })
        .text(function(d) { return d.key; })
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .on("end", draw)
        .start();

    function draw(words) {
        d3.select(svg_location).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return xScale(d.value) + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill[i]; })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.key; });
        $('#resize-button').prop('disabled',false);
    }
    d3.layout.cloud().stop();
}

/**
 * Resizes the word cloud, then begins a cooldown on the button to give the word cloud time to load before reclicking
 */
function resizeWordCloud() {
    $("#word-cloud").empty();
    $("#resize-button").attr("disabled", true);
    let width = window.innerWidth - 230,
        height = window.innerHeight - 160;
    let topic = $("#word-cloud-topic-select").find("option:selected").val();
    if (topic == -1) {
        topic = 0;
    }
    createWordCloud(topic, width, height);
}

/**
 * Loads new word cloud on dropdown change
 */
$(document).ready (function () {
    $("#word-cloud-topic-select").change(function () {
        let topic = $("#word-cloud-topic-select").find("option:selected").val();
        let width = window.innerWidth - 230;
        let height = window.innerHeight - 170;
        createWordCloud(topic, width, height);
    });
});

/**
 * Resizes metadata and annotated text when window is resized
 */
window.addEventListener('resize', function() {
    resizeMetadata();
    resizeAnnotatedText();
}, true);
