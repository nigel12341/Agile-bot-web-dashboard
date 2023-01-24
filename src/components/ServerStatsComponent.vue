<template>
  <div class="card" id="stats">
    <h1>Stats</h1>
    <div class="row">
      <h3>Tickets stats</h3>
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Tickets opened</h5>
                <p class="card-text">{{ ticketsOpened }}</p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Tickets closed</h5>
                <p class="card-text">{{ ticketsClosed }}</p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Tickets in progress</h5>
                <p class="card-text">{{ ticketsInProgress }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <h3>Moderation stats</h3>
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Bans</h5>
            <p class="card-text">{{ bans }}</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Kicks</h5>
            <p class="card-text">{{ kicks }}</p>
          </div>
        </div>
    </div>
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Clears</h5>
            <p class="card-text">{{ clears }}</p>
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Total amount of messages cleared</h5>
            <p class="card-text">{{ totalMessagesCleared }}</p>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
import {doc, onSnapshot} from "firebase/firestore";

export default {
  name: "ServerStatsComponent",
  data() {
    return {
      ticketsOpened: 0,
      ticketsClosed: 0,
      ticketsInProgress: 0,
      totalMessagesCleared: 0,
      clears: 0,
      bans: 0,
      kicks: 0,
    };
  },
  props: {
    db: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async getAndComputeStats() {
      await onSnapshot(doc(this.db, "Guilds", this.$route.query.id, "stats", "tickets"), (doc) => {
        this.ticketsOpened = doc.data().numbTicketsOpend;
        this.ticketsClosed = doc.data().numbTicketsClosed;
        this.ticketsInProgress = this.ticketsOpened - this.ticketsClosed;
      });
      await onSnapshot(doc(this.db, "Guilds", this.$route.query.id, "stats", "moderation"), (doc) => {
        this.clears = doc.data().clears;
        this.bans = doc.data().bans;
        this.kicks = doc.data().kicks;
        this.totalMessagesCleared = doc.data().clearMessages;
      });
    },
  },
  async created() {
    await this.getAndComputeStats(this.db);
  },
}
</script>

<style scoped>

</style>