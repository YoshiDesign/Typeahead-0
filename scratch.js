// function readNodes(node, level){

// 	let message = `${"-".repeat(4 * level)} Node:${node.nodeName}`
// 	if (node.nodeValue) {
// 		message += `, content ${node.nodeValue.trim()}`
// 	}
// 	console.log(message)
// 	var children = node.childNodes || []
// 	for (let i = 0; i < children.length; i++) {
// 		readNodes(children[i], level + 1)
// 	}

// 	if (children.length > 0 )
// 		console.log("</>")
// }

// /**/


// function doStuff(ele, ...stuffToFind){
// ​

// 	const lists = Array.from(ele.querySelectorAll('toc-item'))
// 				.map(e => e.innerHTML)
// 				.filter(l => {console.log(l)})

    
// }
// /**/
// let products = {


// 	"food" : ["bread", "apple","whelps"],
// 	"electronics" : ["VCR", "walkman"],
// 	"portables" : ["phone", "laptop", "backpack", "bottle"]

// }

// let find = ["bread", "vcr"];

// const searchFunc = (item) => {

// 	if (find.toString().toLowerCase().includes(item.toLowerCase())) {
// 		console.log(`Found ${item}`)
// 		return true
// 	}

// }

// for (let category in products) {

// 	console.log(`Searching ${category}...`)
// 	if (products[category].some(searchFunc)) {
// 		console.log(`...in ${category}\n`)
// 	}
	
// }

/*
 * Bonafide TypeAhead
 */

document.addEventListener('DOMContentLoaded', function(){

	var a_words = ["array", "ant", "ants", "art", "artist", "avg"]
	var b_words = ["ban", "bat", "bop", "bee"]
	var c_words = ["car", "carpet", "cat", "col", "cap", "cow"]

	const data = JSON.stringify({

		nodes: {

			a : {
				visited: false,
				wt: 1,
				isMatch: false, 
				nodes:{
					r: {
						visited: false,
						wt: 2,
						isMatch: false,
						nodes: {
							r: {
								visited: false,
								wt: 1,
								isMatch: false,
								nodes: {
									a : {
										visited: false,
										wt: 1,
										isMatch: false,
										nodes: {
											y : {
												visited: false,
												wt: 1,
												isMatch: true,
												nodes: {}
											}
										}
									}
								}

							},
							t: {
								visited: false,
								wt: 2,
								isMatch: true,
								nodes:{
									i : {
										visited: false,
										wt: 1,
										isMatch: false,
										nodes: {
											s : {
												visited: false,
												wt: 1,
												isMatch: false,
												nodes : {
													t : {
														visited: false,
														wt: 1,
														isMatch: true,
														nodes: {}
													}
												}
											}
										}
									}
								}
							}
						}
					}, 
					n: {
						visited: false,
						wt: 1,
						isMatch: false,
						nodes:{
							t: {
								visited: false,
								wt: 1,
								isMatch: true,
								nodes: {}
							}
						}
					}, 
					v: {
						visited: false,
						wt: 1,
						isMatch: false,
						nodes:{
							g: {
								visited: false,
								wt: 1,
								isMatch: true,
								nodes: {}
							}
						}
					}
				}
			},
			b : {
				visited: false,
				wt: 1, 
				isMatch: false,
				nodes:{
					a: {
						visited: false,
						wt: 1,
						isMatch: false,
						nodes:{
							n : {
								visited: false,
								wt: 1,
								isMatch: true,
								nodes: {}
							},
							t : {
								visited: false,
								wt: 1,
								isMatch: true,
								nodes: {}
							}
						}}, 
					o: {
						visited: false,
						wt: 1,
						isMatch: false,
						nodes:{
							p: {
								visited: false,
								wt: 1,
								isMatch: true,
								nodes: {}
							}
						}}, 
					e: {
						visited: false,
						wt: 1,
						isMatch: false,
						nodes:{
							e: {
								visited: false,
								wt: 1,
								isMatch: true,
								nodes: {}}
						}
					}
				}
			},	
			c : {
				visited: false,
				wt: 1, 
				isMatch: false,
				nodes: {
					a: {
						visited: false,
						wt: 1,
						isMatch: false,
						nodes:{
							r: {
								visited: false,
								wt: 1,
								isMatch: true,
								nodes: {
									p: {
										visited: false,
										wt: 1,
										isMatch: false,
										nodes: {
											e: {
												visited: false,
												wt: 1,
												isMatch: false,
												nodes: {
													t : {
														visited: false,
														wt: 1,
														isMatch: true,
														nodes: {}
													}
												}
											}
										}
									}
								}
							},
							t : {
								visited: false,
								wt: 1,
								isMatch: true,
								nodes: {}
							},
							p: {
								visited: false,
								wt: 1,
								isMatch: true,
								nodes: {}	
							}
						}
					}, 
					o: {
						nodes:{
							w: {
								visited: false,
								wt: 1,
								isMatch: true,
								nodes: {}
							},
							l: {
								visited: false,
								wt: 1,
								isMatch: true,
								node: {}
							}
						}
					}, 
				}
			}
		}
	})

	const MATCH = 103

	
	document.getElementById('search').addEventListener('keyup', typeAhead)


	function typeAhead (e){

		if (e.target.value.trim() == ""){
				postMatches([],1)
				return 0
		}
		console.log("--- --- --- ---Initialized Typeahead Search--- --- --- ---")

		// A boyo can dream
		Object.freeze(data)

		// Original query string
		const _q = e.target.value
		// Query string used as search path
		var q = e.target.value

		var sPath = JSON.parse(data)
		var topPath = sPath
		var matches = []
		var _str = ""

		// Follow the Query 
		while (q) {

			console.log(`From Q(${q[0]}) - Loop: sPath is...`)
			console.log(sPath)

			// Descend to next letter
			sPath = sPath.nodes[q[0]] || null
			_str += q[0]

			// No path from here. Continue without appending to string so we can still generate suggestions based on what we have
			if (sPath == null) {
				q = q.slice(1)
				continue
			}



			if (sPath.isMatch) {
				matches.push(_str)
			}

			
			q = q.slice(1)

		}

		/*
			The query string is exhausted. Search for recommendations
		*/

		// Where the query left off
		var _backStart = sPath
		// Backtracking index
		var _bTrack = 0

		while (matches.length < MATCH) {
			postMatches(matches)
			console.log(`String: ${_str}`)
			console.log(`Matches: ${matches.toString()}`)
			console.log(`Available Keys: ${Object.keys(sPath.nodes).toString()}`)
			console.log(`sPath: ${JSON.stringify(sPath)}`)
			console.log(`bTrack: ${_bTrack}`)

			// Used to determine our next descent in the trie
			var next_letter = null

			// Obvious Choice - This node only has 1 place to go
			if (Object.keys(sPath.nodes).length == 1 && sPath.nodes[Object.keys(sPath.nodes)[0]].visited == false) {

				next_letter = Object.keys(sPath.nodes).length ? Object.keys(sPath.nodes)[0] : null		
				console.log(`Acquired Next Letter from [OBVIOUS] search`)
				
			}

			// Determine where to traverse next, if there is more than 1 possible route yet taken
			else if (Object.keys(sPath.nodes).length > 0) {
				
				/*
			     * Determine the next node we'll descend into.
			     * next_letter - Has not been visited and has the highest weight
				 */
				next_letter = getNextLetter(sPath.nodes)

				console.log(`Acquired next letter from [SELECTIVE] search`)

			}

			console.log(`Next_Letter: ${next_letter}`)

			// Backtrack
			if (!next_letter) {

				// Don't backtrack beyond the actual query
				if (_str != _q){
					// Reset search head
					sPath = topPath
	
					// Reduce _str
					_str = _str.slice(0,-1)
					console.log(`Reduced _str: ${_str}`)
	
					// Descend to [_str]
					for (let letter of _str) {
						sPath = sPath.nodes[letter]
					}
	
					_bTrack++
					console.log(`Backtracked`)
				} else {
					console.log("---- Finished ------")
					return 0
				}

			// Move to the next best node
			} else {

				_str += next_letter
				sPath = sPath.nodes[next_letter]
				sPath.visited = true

				console.log(`Updated _str: ${_str}`)

				if (sPath.isMatch) {

					console.log(`New match: ${_str}`)
					matches.push(_str)

				}

			}


		}


	}


	function postMatches(matches, reset=0) {
		document.getElementById('recs').innerHTML = ""
		if (matches.length > 0 && !reset) {
			for (let _m of matches) {
				document.getElementById('recs').innerHTML += `<li>${_m}</li>`
			}
		} 
	}

	// Unused. This can become taxing on compute - only use with small objects
	function hasNode (nodes) {

		for (let key of nodes) {
			if (nodes[key].visited == false)
				return true
		}

		return false

	}


	function getNextLetter(nodes) {


		var best_option = null

		// Find the most popular search path
		for (let key of Object.keys(nodes)) {

			if (nodes[key].visited) {continue}

			for (let _k of Object.keys(nodes)) {

				if (_k == key || nodes[key].wt <= nodes[_k].wt) {continue}

				//  Higher weight and not visited
				if (nodes[key].wt > nodes[_k].wt && nodes[key].visited == false) {
					best_option = key
				}

				else if (best_option == null) {

					if (nodes[_k].wt > nodes[key].wt) {
						best_option = _k
					}
					else if (nodes[key].visited == false) {
						best_option = key
					}
				}
			}

		}

		// Any key will do
		if (best_option == null) {
			for (let key of Object.keys(nodes)) {
				if (nodes[key].visited == false) {
					best_option = key
				}
			}
		}

		return best_option

	}

})














