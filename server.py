import sys
import socketserver as ss
import time
import copy
import threading

import numpy as np

n = 256
m = 3*256
l = 16

class Data(object):
	lock = threading.Lock()
	update = 0
	ratings = {} # user -> { class -> [ v0, v1, v2 ] }
	predictions = {} # user -> [ ( class, [ v0, v1, v2 ] ) ]

def computeServer():
	F = np.random.random([n,l])
	W = np.random.random([l,m])
	idxUser = {} # user -> idx
	numUser = 0
	idxClass = {} # class -> idx
	numClass = 0

	while True:
		Data.lock.acquire()
		run = Data.update > 0
		Data.lock.release()

		if run:

			Data.lock.acquire()
			ratings = copy.deepcopy(Data.ratings)
			Data.lock.release()

			D = np.zeros([n,m])
			R = np.zeros([n,m])

			for u, r in ratings.items():
				if u not in idxUser:
					idxUser[u] = numUser
					numUser += 1
				ui = idxUser[u]
				for c, v in r.items():
					if c not in idxClass:
						idxClass[c] = numClass
						numClass += 1
					ci = idxClass[c]
					for i in range(len(v)):
						D[ui, 3*ci + i] = v[i]
						R[ui, 3*ci + i] = 1

			P = np.dot(F, W)

			W -= (2 * np.dot(np.transpose(F), (R * (P - D)))) / (np.sum(R) + 100) * .1
			F -= (2 * np.dot(R * (P - D), np.transpose(W))) / (np.sum(R) + 100) * .2

			L = np.sum(np.square(P - D) * R) / np.sum(R)

			print(L)

			pred = {}
			for u, i in idxUser.items():
				pred[u] = [
					(c, [
						int(P[i, 3*j + k])
						for k in range(3)
					])
					for c, j in idxClass.items()
				]

			Data.lock.acquire()
			Data.predictions = pred
			Data.lock.release()

			Data.lock.acquire()
			Data.update -= 1
			Data.lock.release()

		else:
			time.sleep(.01)

thread = threading.Thread(target=computeServer)
thread.start()

class Handler(ss.BaseRequestHandler):

	def __init__(self, request, client_address, server):
		ss.BaseRequestHandler.__init__(self, request, client_address, server)
		return

	def setup(self):
		ss.BaseRequestHandler.setup(self)
		return

	def handle(self):
		while True:
			try:
				data = [b.decode('UTF-8') for b in self.request.recv(1024).split()]
				print(data)

				if len(data) < 2:
					break

				action = data[0]
				user = data[1]
				if action == "submit" and len(data) == 6:
					print("received submit")
					courseID = data[2]
					Data.lock.acquire()
					if user not in Data.ratings:
						Data.ratings[user] = {}
					Data.ratings[user][courseID] = [int(s) for s in data[3:6]]
					Data.update = 256
					Data.lock.release()
				elif action == "query" and len(data) == 2:
					print("received query")
					Data.lock.acquire()
					predictions = copy.deepcopy(Data.predictions)
					Data.lock.release()
					if user in predictions:
						for c, l in predictions[user]:
							self.request.send((str(c) + " " + " ".join(str(s) for s in l) + "\n").encode('UTF-8'))
					self.request.send("done\n".encode('UTF-8'))
			except Exception as e:
				print(e)
				break
		return

	def finish(self):
		ss.BaseRequestHandler.finish(self)
		return

server = ss.TCPServer(('0.0.0.0', 6283), Handler)
print(server.server_address)
server.serve_forever()

thread.join()

