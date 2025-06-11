from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

# Your minimax and helper functions

def check_winner(board, player):
    win_conditions = [(0, 1, 2), (3, 4, 5), (6, 7, 8),
                      (0, 3, 6), (1, 4, 7), (2, 5, 8),
                      (0, 4, 8), (2, 4, 6)]
    for condition in win_conditions:
        if all(board[i] == player for i in condition):
            return True
    return False

def is_full(board):
    return ' ' not in board

def minimax(board, depth, alpha, beta, is_maximizing):
    if check_winner(board, 'O'):
        return 10 - depth
    if check_winner(board, 'X'):
        return depth - 10
    if is_full(board):
        return 0

    if is_maximizing:
        max_eval = -math.inf
        for i in range(9):
            if board[i] == ' ':
                board[i] = 'O'
                eval = minimax(board, depth + 1, alpha, beta, False)
                board[i] = ' '
                max_eval = max(max_eval, eval)
                alpha = max(alpha, eval)
                if beta <= alpha:
                    break
        return max_eval
    else:
        min_eval = math.inf
        for i in range(9):
            if board[i] == ' ':
                board[i] = 'X'
                eval = minimax(board, depth + 1, alpha, beta, True)
                board[i] = ' '
                min_eval = min(min_eval, eval)
                beta = min(beta, eval)
                if beta <= alpha:
                    break
        return min_eval

def best_move(board):
    best_score = -math.inf
    move = None
    for i in range(9):
        if board[i] == ' ':
            board[i] = 'O'
            score = minimax(board, 0, -math.inf, math.inf, False)
            board[i] = ' '
            if score > best_score:
                best_score = score
                move = i
    return move


# Routes

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ai-move', methods=['POST'])
def ai_move():
    data = request.json
    board = data['board']  # Expecting list of 9 elements with 'X', 'O', or ' '
    move = best_move(board)
    return jsonify({'move': move})


if __name__ == '__main__':
    app.run(debug=True)
