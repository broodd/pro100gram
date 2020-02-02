<template>
  <v-list v-if="polls.length">
    <v-list-item-group
      v-model="pollSelect"
      color="primary"
    >
      <div v-for="(poll, index) in polls" :key="poll._id">
        <v-list-item
          class="poll"
          @click="toVote(poll._id, index)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="poll.text"></v-list-item-title>
            <v-list-item-title v-text="percentage(poll.votes.length, totalVotes)"></v-list-item-title>
            <v-progress-linear :value="percentage(poll.votes.length, totalVotes)"></v-progress-linear>
          </v-list-item-content>
        </v-list-item>
        <v-card-title v-if="!anonime && poll.votes.length">
          <v-chip pill v-for="(vote, key) in poll.votes" :key="key" class="mr-2">
            <v-avatar
              left
            >
              <img :src="vote.profile.img ? vote.profile.img : `https://api.adorable.io/avatars/100/${vote.email}.png`" alt="">
            </v-avatar>
            {{ vote.profile.name }}
          </v-chip>
        </v-card-title>
      </div>
    </v-list-item-group>
  </v-list>
</template>

<script>
import PollService from '@/services/poll';

export default {
  props: {
    polls: {
      type: Array,
      required: true
    },
    anonime: {
      type: Boolean,
      default: true
		},
		totalVotes: {
			type: Number,
			required: true
		},
		defaultPollSelect: {
			type: Number
		}
  },
  data: () => ({
    pollSelect: undefined
  }),
  methods: {
		async toVote (id) {
			try {
        const voteData = await PollService.toVote({
          id
        });
      } catch (e) {
				store.dispatch('setError', e)
			}
    },
    percentage (single, total) {
			const p = total > 0 ? (single / total).toFixed(1) * 100 : 0;
			return `${p}%`;
		},
  },
	created () {
		this.pollSelect = this.defaultPollSelect;
	}
}
</script>