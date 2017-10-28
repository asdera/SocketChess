function movable(pos, colour, piece) {
	if (colour != move.turn) {
		// If it is not the player's turn
		return false;
	}
	
	if (piece == "empty") {
		// If there is no piece
		return false;
	}
	
	if (pos[0] == pos[2] && pos[1] == pos[3]) {
		// If the piece is not moving anywhere
		return false;
	}
	
	if (tile([pos[2], pos[3]]).colour == move.turn) {
		// If the piece moving on top of a friendly piece
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

promotion = {
	rules: ["R", "N", "B", "Q"],
	to: false
}