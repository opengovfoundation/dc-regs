/*This scraper has been designed to use CasperJS/PhantomJS to scrape the DC municipal regulations.
With a little tweaking, it'll happily burn through any page with large document sets. 

The folder organization is an attempt to avoid problems with filename length limits. 

TO-DO: -note regulations without accompanying document.
-Incorporate renamer.rb bandages here (or incorporate filename-safe whitelist)

Note: If you're going to run this with multiple instances of casper, assign each instance a small piece of the links, or you'll start getting C++ errors. 

 */

var casper = require('casper').create({   
    verbose: true,
    logLevel: "debug",
    userAgent: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
    pageSettings: {
      loadImages:  false,         // The WebPage instance used by Casper will
      loadPlugins: false,     // use these settings
      webSecurityEnabled: false
    }
});
phantom.cookiesEnabled=true;
var fs = require('fs')

var links=[];
var titles=[];
var ret="";

function getLinks(){
	var links = document.querySelectorAll('.noticeform tbody tr td a')
	matches = Array.prototype.slice.call(links, function(e) {
        return e;
    });
	var linker =  Array.prototype.map.call(matches, function(e){
		return e['href'];
	})
	return linker;
};

function getTitles(){
	var titles = document.querySelectorAll('.noticeform tbody tr span')
	middles = Array.prototype.slice.call(titles, function(e) {
        return e;
    });
	return Array.prototype.map.call(middles, function(e){
		return e['innerText'];
	})
}


function getThemAll(){
	//snag all of them
	var rule_numbers = document.querySelectorAll('.noticeform tbody tr td:nth-child(1) a')
		var nums = Array.prototype.slice.call(rule_numbers, function(e) {
	        return e;
	    });
		var finumbs = Array.prototype.map.call(nums, function(e){

			return e['innerText'];
		})
	var headers = document.querySelectorAll('.noticeform tbody tr td:nth-child(2) span')
		var heads = Array.prototype.slice.call(headers, function(e) {
	        return e;
	    });
		var finheads = Array.prototype.map.call(heads, function(e){
			return e['innerText'];
		})
	var links = document.querySelectorAll('.noticeform tbody tr td:nth-child(3) a')
		var lins = Array.prototype.slice.call(links, function(e) {
	        return e;
	    });
		var finlinks = Array.prototype.map.call(lins, function(e){
			return e['href'];
		})

	var ttle = document.querySelector('#ctl00_ContentPlaceHolder_lblTitleNo');
	 var fttle = ttle['innerText']

	var chpt = document.querySelector('.titlenameOj');

	var chnum = document.querySelector("#ctl00_ContentPlaceHolder_lblChapterNo");
	var nchnum = chnum['innerText'].trim().split(": ")[1]
	var fchp = nchnum + " " + chpt['innerText'];

	return { numbs: finumbs, 
			heads: finheads, 
			lnks: finlinks,
			xtle: fttle,
			chapter: fchp
		}

}

function getTitle(){
	var title=document.querySelector('.titlenameOj');
	return title['innerText'];
}



casper.start("http://dcregs.dc.gov/Search/DCMRSearchByTitle.aspx",function(){
	 links = this.evaluate(getLinks);
	 titles = this.evaluate(getTitles);

//Open every title link. If you want to pick up where you left off, slice it here, slice it here.
	this.each(links, function(self, link){
			var title = this.evaluate(getTitle);
				self.thenOpen(link, function(){
					//For regulations of uncertain depth, you would need to evaluate here whether you've another set of subsections or if you can keep going
					this.echo("opened " + link)

					//I know my variable names are stupid. Hush
				var sublinks = this.evaluate(getLinks)
					this.each(sublinks, function(self, link){
						self.thenOpen(link,function(){
						var result = this.evaluate(getThemAll);
						var nums = result.numbs;
						var heads = result.heads;
						var links = result.lnks;
						var title = result.xtle.replace(/\//, '[slash]') //a marker that can be put back later when it's not organized into a file system
						var chapter = result.chapter.replace(/\//, '[slash]')
						for(i=0; i<links.length; i++){
							self.download(links[i], "dcregs/"+title+"/"+chapter+"/"+nums[i]+ " " + heads[i].replace(/\//, '[slash]') +".doc");
						
						}

					});
					})
					//this.echo(test);
				});
		});

	
});



casper.run(function(){
	
	//this.echo(titles).exit()

})