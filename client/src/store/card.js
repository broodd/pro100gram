import Vue from "vue";
import CardService from '@/services/card';

export default {
  state: {
    cards: [],
  },
  mutations: {
    setCards (state, payload) {
      state.cards = payload;
    },
    updateCard (state, payload) {
      Vue.set(state.cards, payload.index, payload);
    },
    newOrder (state, { index, order }) {
      state.cards[index].orders.push(order);
    },
    updateOrder(state, { index, orderIndex, order }) {
      if (order.closed) {
        Vue.set(state.cards[index].orders[orderIndex], 'closed', true);  
      } else {
        Vue.set(state.cards[index].orders, orderIndex, order);
      }
		},
		deleteVote(state, { index, existingIndex, userIndex }) {
			state.cards[index].polls[existingIndex].votes.splice(userIndex, 1);
		},
		addVote(state, { index, voteIndex, user }) {
			state.cards[index].polls[voteIndex].votes.push(user);
		}
  },
  actions: {
    async getCards ({ commit, getters }, page = 1) {
      try {
        const res = await CardService.getCards({
          page
        });

        if (res.data) {
          let cards = res.data.data;
          if (page != 1) {
            cards = getters.cards.concat(cards);
          }
          commit('setCards', cards);
        }
      } catch (err) {
        commit('setError', err);
      }
    },
    async getCard ({ commit, getters }, id) {
      try {
        const res = await CardService.getCard({
          id
        });

        if (res.data) {
          commit('setCards', [res.data.data]);
        }
      } catch (err) {
        commit('setError', err);
      }
    },
    async SOCKET_updateCard ({ state, getters, commit }, data) {
      if (!getters.userId) return
      const oldCard = getters.cardById(data._id);
      const newCard = {
        ...oldCard,
        ...data
      };
      commit('updateCard', newCard);
    },
    async SOCKET_newOrder ({ state, getters, commit }, data) {
      if (!getters.userId) return

      const oldCard = getters.cardById(data._id);
      
      commit('newOrder', {
        index: oldCard.index,
        order: data.order
      });
    },
    async SOCKET_updateOrder ({ state, getters, commit }, data) {
      if (!getters.userId) return
      
      const oldCard = getters.cardById(data._id);
      
      if (!oldCard) return
      
      const orderIndex = oldCard.orders.findIndex(order => order._id == data.order._id);
      commit('updateOrder', {
        index: oldCard.index,
        orderIndex,
        order: data.order
      });
    },
    async SOCKET_toVote ({ state, getters, commit }, data) {
      if (!getters.userId) return
      
      const oldCard = getters.cardById(data._id);
      
      if (!oldCard) return
      
			const { vote, existingVote, existingIndex, voteIndex } = data;

			if (existingVote) {
				const userIndex = oldCard.polls[existingIndex].votes.findIndex(vote => {
					if (oldCard.anonime) {
            return vote == getters.userId;
					} else {
            return vote._id == getters.userId;
          }
				});

				commit('deleteVote', {
					index: oldCard.index,
					existingIndex,
					userIndex
				});
			}

			commit('addVote', {
				index: oldCard.index,
				voteIndex,
				user: vote
			});
    }
  },
  getters: {
    cards (state) {
      return state.cards
    },
    cardById (state) {
      return id => {
        return state.cards.find((card, index) => {
          // return card._id == id
          return card._id == id ? (card.index = index, true) : false;
        })
      }
    }
  }
}