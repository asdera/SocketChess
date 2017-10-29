function movable(pos, colour, piece) {
	
	if (colour != move.turn) {
		// It is not the player's turn
		return false;
	} else if (piece == "empty") {
		// There is no piece
		return false;
	} else if (pos[0] == pos[2] && pos[1] == pos[3]) {
		// The piece is not moving anywhere
		return false;
	} else if (tile([pos[2], pos[3]]).colour == move.turn) {
		// The piece moving on top of a friendly piece
		return false;
	}

	switch(piece) {
	    case "R":
	    	if (pos[0] == pos[2]) {
	    		// Vertical
				for (i = Math.min(pos[1], pos[3]) + 1; i < Math.max(pos[1], pos[3]); i++) {
					if (tile([pos[0], i]).piece != "") {
						return false;
					}
				}
				return true;
			} else if (pos[1] == pos[3]) {
				// Horizontal
				for (i = Math.min(pos[0], pos[2]) + 1; i < Math.max(pos[0], pos[2]); i++) {
					if (tile([i, pos[1]]).piece != "") {
						return false;
					}
				}
				return true;
			}
	        break;
	    case "N":
	    	if (Math.abs(pos[0] - pos[2]) == 1 && Math.abs(pos[1] - pos[3]) == 2) {
				return true;
			} else if (Math.abs(pos[0] - pos[2]) == 2 && Math.abs(pos[1] - pos[3]) == 1) {
				return true;
			}
	        break;
	    case "B":
	    	if (pos[0] - pos[2] == pos[1] - pos[3]) {
	    		// Positive
	    		for (i = 1; i < Math.abs(pos[1] - pos[3]); i++) {
					if (tile([Math.min(pos[0], pos[2]) + i, Math.min(pos[1], pos[3]) + i]).piece != "") {
						return false;
					}
				}
				return true;
			} else if (pos[0] - pos[2] == pos[3] - pos[1]) {
				// Negative
				for (i = 1; i < Math.abs(pos[0] - pos[2]); i++) {
					if (tile([Math.min(pos[0], pos[2]) + i, Math.max(pos[1], pos[3]) - i]).piece != "") {
						return false;
					}
				}
				return true;
			}
	        break;
	    case "Q":
	    	if (pos[0] == pos[2]) {
	    		// Vertical
				for (i = Math.min(pos[1], pos[3]) + 1; i < Math.max(pos[1], pos[3]); i++) {
					if (tile([pos[0], i]).piece != "") {
						return false;
					}
				}
				return true;
			} else if (pos[1] == pos[3]) {
				// Horizontal
				for (i = Math.min(pos[0], pos[2]) + 1; i < Math.max(pos[0], pos[2]); i++) {
					if (tile([i, pos[1]]).piece != "") {
						return false;
					}
				}
				return true;
			}
	    	if (pos[0] - pos[2] == pos[1] - pos[3]) {
	    		// Positive
	    		for (i = 1; i < Math.abs(pos[1] - pos[3]); i++) {
					if (tile([Math.min(pos[0], pos[2]) + i, Math.min(pos[1], pos[3]) + i]).piece != "") {
						return false;
					}
				}
				return true;
			} else if (pos[0] - pos[2] == pos[3] - pos[1]) {
				// Negative
				for (i = 1; i < Math.abs(pos[0] - pos[2]); i++) {
					if (tile([Math.min(pos[0], pos[2]) + i, Math.max(pos[1], pos[3]) - i]).piece != "") {
						return false;
					}
				}
				return true;
			}
	        break;
	    case "K":
			if (Math.abs(pos[0] - pos[2]) == 1 && Math.abs(pos[1] - pos[3]) == 1) {
				// castle[colour] = false;
				return true;
			} else if (pos[0] == pos[2] && Math.abs(pos[1] - pos[3]) == 1) {
				// castle[colour] = false;
				return true;
			} else if (Math.abs(pos[0] - pos[2]) == 1 && pos[1] == pos[3]) {
				// castle[colour] = false;
				return true;
			} else if (castle[colour]) {
				if (colour == "white" && pos[3] == 1) {
					if (pos[2] - pos[0] == 2 && tile([8, 1]).piece == "R" && tile([6, 1]).piece == "") {
						castle.to = "whiteKingside";
						return true;
					} else if (pos[0] - pos[2] == 2 && tile([1, 1]).piece == "R" && tile([3, 1]).piece == "" && tile([4, 1]).piece == "") {
						castle.to = "whiteQueenside";
						return true;
					}
				}
			}
	        break;
	    case "P":
	        if (colour == "white") {
		        if (tile([pos[2], pos[3]]).piece == "") {
		        	if (pos[0] == pos[2]) {
		        		if (pos[3]-pos[1] == 1) {
		        			if (pos[3] == 8) {
		        				promotion.to = true;
		        			}
		        			return true;
		        		} else if (pos[3]-pos[1] == 2) {
		        			if (pos[1] == 2 && tile([pos[2], pos[1]+1]).piece == "") {
		        				if (pos[3] == 8) {
			        				promotion.to = true;
			        			}
			        			return true;
		        			}
		        		}
		        	}
		        }
	        	else if (tile([pos[2], pos[3]]).colour == "black") {
	        		if (pos[3]-pos[1] == 1 && Math.abs(pos[0] - pos[2]) == 1) {
	        			if (pos[3] == 8) {
	        				promotion.to = true;
	        			}
	        			return true;
	        		}
	        	}
	        } else {
	        	if (tile([pos[2], pos[3]]).piece == "") {
		        	if (pos[0] == pos[2]) {
		        		if (pos[1]-pos[3] == 1) {
		        			if (pos[3] == 1) {
		        				promotion.to = true;
		        			}
		        			return true;
		        		} else if (pos[1]-pos[3] == 2) {
		        			if (pos[1] == 7 && tile([pos[2], pos[1]-1]).piece == "") {
		        				if (pos[3] == 1) {
			        				promotion.to = true;
			        			}
			        			return true;
		        			}
		        		}
		        	}
		        }
	        	else if (tile([pos[2], pos[3]]).colour == "white") {
	        		if (pos[1]-pos[3] == 1 && Math.abs(pos[0] - pos[2]) == 1) {
	        			if (pos[3] == 1) {
	        				promotion.to = true;
	        			}
	        			return true;
	        		}
	        	}
	        }
	        break;
	    default:
	        return false;
	}
	return false;
}

castle = {
	black: true,
	white: true,
	to: false
}

promotion = {
	rules: ["R", "N", "B", "Q"],
	piece: {white: "Q", black: "Q"},
	to: false
}