const remote = require("electron").remote;

let buildpath = require("path").join;

let path = remote.app.getAppPath();

let imonke = require("imonke");

const name = require(
    buildpath(
        path, 
        "src/monkelib/values.js",
    ),
).config.name;

document.title = name + " Feed";

const createCss = async (path) => {
    let myCss = document.createElement("link");
    myCss.type = "text/css";
    myCss.rel = "stylesheet";
    myCss.href = path;
    return myCss;
}; // Creates a css element

const css = async () => {
    let scripts = document.getElementById("scripts");
    let index = [
        createCss(
            buildpath(
                path, 
                "src/monkeshare/centered-content.css"
            ),
        ),
        createCss(
            buildpath(
                path, 
                "src/monkeshare/shared-lib.css"
            ),
        ),
    ];
    for (let value in index) {
        scripts.appendChild(
            await index[value],
        );
    };
}; // Adds some css scripts to an element

const awaitTasks = async (tasks) => {
    for (let index in tasks) {
        await tasks[index];
    };
}; //Awaits a list of async functions

const createFeed = async () => {
    let feed = document.createElement("div");
    return feed;
}; // Creates a feed object using a div tag

const br = () => {
    return document.createElement("br");
}; // Creates a break html tag

const createFeedObject = async (data) => {
    let tasks = [];

    let user = new imonke.User(
        {
            id: data.author,
        },
    );
    
    tasks.push(
        user.get()
    );

    let FeedObject = document.createElement("div");

    const addFeedValues = (values) => {
        for (let value in values) {
            FeedObject.appendChild(
                values[value],
            );
        };
    };

    FeedObject.className += "container";
	
	let Account = document.createElement("div");
	Account.className += "AccountBox";
	

    let pfp = document.createElement("img");

    pfp.className += "Monkepfp centered-content";
	
    pfp.src = buildpath(
        path, 
        "src/monkeshare/dump/imonke.ico",
    );

    let authorName = document.createElement("span");
	
    authorName.className += "MonkeText";
	
    await awaitTasks(tasks);

    authorName.innerText = user._data.nick;
	
    Account.appendChild(pfp);
    Account.appendChild(authorName);
	
    let LikeAndDislike = document.createElement("div");
    LikeAndDislike.className += "LikeBox";

    
    let likeButton = document.createElement("img");

    likeButton.className += "LikeDislike centered-content";
	
    likeButton.src = buildpath(
        path, 
        "src/monkeshare/up.png",
    );
	
    let likeCounter = document.createElement("span");

	    
    likeCounter.className += "CounterText";
	
    likeCounter.innerText = data.like_count.toString();
	
	
    let dislikeButton = document.createElement("img");

    dislikeButton.className += "LikeDislike centered-content";
	
    dislikeButton.src = buildpath(
        path, 
        "src/monkeshare/down.png",
    );
	
    let dislikeCounter = document.createElement("span");
	
    dislikeCounter.className += "CounterText";
	
    dislikeCounter.innerText = data.dislike_count.toString();
	
    LikeAndDislike.appendChild(likeButton);
    LikeAndDislike.appendChild(likeCounter);
    LikeAndDislike.appendChild(dislikeButton);
    LikeAndDislike.appendChild(dislikeCounter);
	

    let post = document.createElement("img");

    post.alt = "Monke";

    post.className += "centered-content Monkepic";

    post.src = data.file_url;
    let PostBox = document.createElement("div");
    PostBox.className += "PostInfo";

    PostBox.appendChild(post);
    PostBox.appendChild(br());
    PostBox.appendChild(br());
    PostBox.appendChild(Account);
    PostBox.appendChild(LikeAndDislike);

    addFeedValues(
        [
            br(),
            br(),
	    PostBox,
            br(),
        ],
    );
    return FeedObject;
}; // Creates the feed object (Picture, pfp, user)

const feed = async () => {

    let feedOverview = await createFeed();

    let MonkeFeedObject = new imonke.Feed(
        {
            feed: "all",
        },
    );

    let MonkeFeedPromised = MonkeFeedObject.get();

    document.getElementById("feed").appendChild(feedOverview);

    let tasks = [];

    let MonkeFeed = await MonkeFeedPromised;
    
    for (let index in MonkeFeed) {
        tasks.push(
            createFeedObject(
                MonkeFeed[index]._data,
            ),
        );
    };

    for (let task in tasks) {
        let promised = await tasks[task];
        feedOverview.appendChild(
            promised,
        );
    };
}; // Creates the feed overview and parses feed content from iMonke

css();
feed();

