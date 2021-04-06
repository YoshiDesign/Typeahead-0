/*
 TODO Optimizations  
 		- Each node must keep track of the number of consecutive nodes in its previous generations which have already been fully traversed.
 		  This way we don't backtrack to nodes which have already been fully traversed, instead we begin backtracking from a point
 		  where a bifurcation of the search path is possible.

 		 - Similarly, while constructing the data, we can tack a property onto each object, n, which is a count of consecutive previous generations that 
 		   only had 1 node to traverse into. This can also represent the number of steps back we can take in 1 fel swoop
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

			// Add 
			if (sPath.isMatch && _q.length <= _str.length) {
				matches.push(_str)
			}
			
			q = q.slice(1)

		}

		/*
			The query string is exhausted. Begin searching for recommendations from where the query left off
		*/
		
		//var _track = 0

		while (matches.length < MATCH) {

			// Update view
			postMatches(matches)

			// console.log(`String: ${_str} - ${_track}`)
			// _track++

			// Used to determine our next descent in the trie
			var next_letter = null

			// Obvious Choice - This node only has 1 place to go
			if (Object.keys(sPath.nodes).length == 1 && sPath.nodes[Object.keys(sPath.nodes)[0]].visited == false) {

				next_letter = Object.keys(sPath.nodes).length ? Object.keys(sPath.nodes)[0] : null		
				
			}

			// Determine where to traverse next, if there is more than 1 possible route yet taken
			else if (Object.keys(sPath.nodes).length > 0) {
				
				/*
				 * Determine the next node we'll descend into.
				 * next_letter - Has not been visited and has the highest weight
				 */
				next_letter = getNextLetter(sPath.nodes)

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
	
					// Descend to [_str]
					for (let letter of _str) {
						sPath = sPath.nodes[letter]
					}

				// backtracked all the way to the initial query string. All paths have been exhausted
				} else {
					return 0
				}

			// Move to the next best node
			} else {

				_str += next_letter
				sPath = sPath.nodes[next_letter]
				sPath.visited = true

				if (sPath.isMatch) {
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














