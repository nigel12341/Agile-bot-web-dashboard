<template>
  <!DOCTYPE html>
  <div class="card">
    <div id="botSettings" v-if=authorized>
      <div id="settings " v-if=setupStatusBackend>
        <h2>Bot settings</h2>
        <h4>You can also change these settings in discord using the /setup command!</h4>

        <div class="d-grid gap-2 col-6 mx-auto" id="roleSettings">

          <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRoleSettings"
                  aria-expanded="false" aria-controls="collapseRoleSettings">
            Role settings
          </button>

          <div class="collapse" id="collapseRoleSettings">
            <div class="card card-body">
              <form class="form-control">
                <div class="input-group mb-3">
                  <span class="input-group-text">Admin role</span>
                  <span class="input-group-text">ID:</span>
                  <input type="text" class="form-control" id="adminRoleInput" :placeholder=adminRole
                         aria-label="admin role">
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text">Moderator role</span>
                  <span class="input-group-text">ID:</span>
                  <input type="text" class="form-control" id="moderatorRoleInput" :placeholder=modRole aria-label="admin role">
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text">Helper role</span>
                  <span class="input-group-text">ID:</span>
                  <input type="text" class="form-control" id="helperRoleInput" :placeholder=helperRole aria-label="admin role">
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text">Staff role</span>
                  <span class="input-group-text">ID:</span>
                  <input type="text" class="form-control" id="staffRoleInput" :placeholder=staffRole aria-label="admin role">
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text">Muted role</span>
                  <span class="input-group-text">ID:</span>
                  <input type="text" class="form-control" id="mutedRoleInput" :placeholder=mutedRole aria-label="admin role">
                </div>
                <button id="saveRoleSettingsBtn" class="btn btn-success" @click="saveRoleSettings()">Save</button>
              </form>
            </div>
          </div>
        </div>


        <div class="d-grid gap-2 col-6 mx-auto" id="badWordsFilterSettings">

          <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBadWordsFilterSettings"
                  aria-expanded="false" aria-controls="collapseBadWordsFilterSettings">
            Bad words filter settings
          </button>

          <div class="collapse" id="collapseBadWordsFilterSettings">
            <div class="card card-body">
              <form class="form-control" v-if="badWordsFilterArray.length > 0">
                <h4>Current words in the filter</h4>
                <ol v-for="badWords in badWordsFilterArray" :key="badWords" class="list-group">
                  <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                      {{ badWords }}
                    </div>
                    <button @click="deleteBadWord(badWords)" class="badge bg-danger">X</button>
                  </li>
                </ol>
              </form>
              <h5 v-else>List empty</h5>
              </div>
            <div class="card card-body">
              <form>
                <div class="input-group mb-3">
                  <span class="input-group-text">Add word to filter</span>
                  <input v-model="wordToAddToFilter" type="text" class="form-control" id="addBadWordInput" aria-label="add bad word">
                </div>
                <button id="saveRoleSettingsBtn" class="btn btn-success" @click="addBadWord()">Add</button>
              </form>
            </div>
          </div>
        </div>


        <div class="d-grid gap-2 col-6 mx-auto" id="accessSettings">

          <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseAccessSettings" aria-expanded="false" aria-controls="collapseAccessSettings">
            Access settings
          </button>

          <div class="collapse" id="collapseAccessSettings">
            <div class="card card-body">
              <div class="collapse" id="collapseAccessSettings">
                <div class="card card-body">
                  <form class="form-control">
                    <h4>Allow helper in tickets</h4>

                    <input type="radio" class="btn-check" name="helperTicketPerms" id="trueHelperInTicket"
                           autocomplete="off" value="true" checked>
                    <label class="btn btn-outline-success" for="trueHelperInTicket">Yes</label>

                    <input type="radio" class="btn-check" name="helperTicketPerms" id="falseHelperInTicket"
                           autocomplete="off" value="false">
                    <label class="btn btn-outline-danger" for="falseHelperInTicket">No</label>

                    <h4>Allow moderator to ban</h4>
                    <input type="radio" class="btn-check" name="moderatorBanAccess" id="trueModUseBan"
                           autocomplete="off" value="true" checked>
                    <label class="btn btn-outline-success" for="trueModUseBan">Yes</label>

                    <input type="radio" class="btn-check" name="moderatorBanAccess" id="falseModUseBan"
                           autocomplete="off" value="false">
                    <label class="btn btn-outline-danger" for="falseModUseBan">No</label>
                    <br>
                    <button id="saveAccessSettingsBtn" class="btn btn-success" @click="saveAccessSettings()">Save</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-grid gap-2 col-6 mx-auto" id="categorySettings">

          <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseCatagorySettings" aria-expanded="false"
                  aria-controls="collapseCatagorySettings">
            Category settings
          </button>

          <div class="collapse" id="collapseCatagorySettings">
            <div class="card card-body">
              <form class="form-control">
                <div class="input-group mb-3">
                  <span class="input-group-text">Ticket category</span>
                  <span class="input-group-text">ID:</span>
                  <input type="text" class="form-control" id="ticketCategoryInput" :placeholder=ticketCategory aria-label="admin role">
                </div>
                <button id="saveCategorySettingsBtn" class="btn btn-success" @click="saveCategorySettings()">Save</button>
              </form>
            </div>
          </div>
        </div>
        <div class="d-grid gap-2 col-6 mx-auto" id="channelSettings">
          <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseChannelSettings" aria-expanded="false"
                  aria-controls="collapseChannelSettings">
            Channel settings
          </button>
          <div class="collapse" id="collapseChannelSettings">
            <div class="card card-body">
              <form class="form-control">
                <div class="input-group mb-3">
                  <span class="input-group-text">Logs channel</span>
                  <span class="input-group-text">ID:</span>
                  <input type="text" class="form-control" id="logsChannelInput" :placeholder=logsChannel aria-label="admin role">
                </div>
                <button id="saveChannelSettingsBtn" class="btn btn-success" @click="saveChannelSettings()">Save</button>
              </form>
            </div>
          </div>
        </div>
        <div class="d-grid gap-2 col-6 mx-auto" id="featureToggles">

          <button class="btn btn-primary" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseFeatureToggleSettings" aria-expanded="false"
                  aria-controls="collapseFeatureToggleSettings">
            Feature toggles
          </button>
          <div class="collapse" id="collapseFeatureToggleSettings">
            <div class="card card-body">
              <form class="form-control">
                <h4>Automod</h4>

                <input type="radio" class="btn-check" name="autoModToggle" id="trueAutoModToggle"
                       autocomplete="off" value="true" checked>
                <label class="btn btn-outline-success" for="trueAutoModToggle">Yes</label>

                <input type="radio" class="btn-check" name="autoModToggle" id="falseAutoModToggle"
                       autocomplete="off" value="false">
                <label class="btn btn-outline-danger" for="falseAutoModToggle">No</label>

                <h4>Logs</h4>
                <input type="radio" class="btn-check" name="logsToggle" id="trueLogsToggle"
                       autocomplete="off" value="true" checked>
                <label class="btn btn-outline-success" for="trueLogsToggle">Yes</label>

                <input type="radio" class="btn-check" name="logsToggle" id="falseLogsToggle"
                       autocomplete="off" value="false">
                <label class="btn btn-outline-danger" for="falseLogsToggle">No</label>

                <h4>Moderation commands</h4>
                <input type="radio" class="btn-check" name="modCommandsToggle" id="trueModCommandsToggle"
                       autocomplete="off" value="true" checked>
                <label class="btn btn-outline-success" for="trueModCommandsToggle">Yes</label>

                <input type="radio" class="btn-check" name="modCommandsToggle" id="falseModCommandsToggle"
                       autocomplete="off" value="false">
                <label class="btn btn-outline-danger" for="falseModCommandsToggle">No</label>

                <h4>Tickets</h4>
                <input type="radio" class="btn-check" name="ticketToggle" id="trueTicketToggle"
                       autocomplete="off" value="true" checked>
                <label class="btn btn-outline-success" for="trueTicketToggle">Yes</label>

                <input type="radio" class="btn-check" name="ticketToggle" id="falseTicketToggle"
                       autocomplete="off" value="false">
                <label class="btn btn-outline-danger" for="falseTicketToggle">No</label>

                <h4>Bad words filter</h4>
                <input type="radio" class="btn-check" name="badWordsToggle" id="trueBadWordsToggle"
                       autocomplete="off" value="true" checked>
                <label class="btn btn-outline-success" for="trueBadWordsToggle">Yes</label>

                <input type="radio" class="btn-check" name="badWordsToggle" id="falseBadWordsToggle"
                       autocomplete="off" value="false">
                <label class="btn btn-outline-danger" for="falseBadWordsToggle">No</label>
                <br>
                <button class="btn btn-success" id="saveFeatureTogglesBtn" @click="saveFeaturesToggleSettings()">Save</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h1>Setup incomplete</h1>
        <h2>Setup the bot before you can change settings!</h2>
        <h2>Use the /setup command in discord to setup the bot!</h2>
      </div>
    </div>
    <div id="defaultScreen" v-else-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div id="botSettingsUnauth" v-else-if="!authorized">
      <h1>Bot settings</h1>
      <h2>You are not authorized to change bot settings!</h2>
    </div>
    <div id="botSettingsPermFail" v-else>
      <h1>Bot settings</h1>
      <h2>Something went wrong while checking your permissions. Please try again later!</h2>
    </div>
  </div>

</template>

<script>
import {doc, getDoc, onSnapshot, updateDoc, arrayRemove, arrayUnion} from "firebase/firestore";
import {getAuth} from "firebase/auth";

export default {
  name: "ServerSettingsComponent",
  data() {
    return {
      modRole: "Unavailable",
      adminRole: "Unavailable",
      staffRole: "Unavailable",
      helperRole: "Unavailable",
      mutedRole: "Unavailable",
      logsChannel: "Unavailable",
      ticketCategory: "Unavailable",
      helperTicketAcces: "Unavailable",
      moderatorBanAccess: "Unavailable",
      badWordsFilterArray: ["Unavailable"],

      setupStatusBackend: false,
      authorized: false,
      fetchFailed: false,
      loading: true,
      badWordsFilterToggle: false,

      access_token: null,
      serverId: null,

      wordToAddToFilter: null,
    }
  },
  props: {
    db: {
      type: Object,
      required: true,
    },
  },

  methods: {
    async fetchSettings() {

      const createSettingsCatagoriesRef = doc(this.db, "Guilds", this.serverId, "settings", "catagories");
      const createSettingsAccessRef = doc(this.db, "Guilds", this.serverId, "settings", "access");
      const createSettingsRolesRef = doc(this.db, "Guilds", this.serverId, "settings", "roles");
      const createSettingsChannelsRef = doc(this.db, "Guilds", this.serverId, "settings", "channels");
      const createfeaturesEnabledSettingsRef = doc(this.db, "Guilds", this.serverId, "settings", "featuresEnabled");
      const createSetupStatusRef = doc(this.db, "Guilds", this.serverId);
      const badWordsFitlerRef = doc(this.db, "Guilds", this.serverId, "settings", "badWordsFilter");

      const docSnap = await getDoc(createSetupStatusRef);
      if (docSnap.exists()) {
        this.setupStatusBackend = docSnap.data().setup;
      } else {
        this.setupStatusBackend = false;
      }

      onSnapshot(badWordsFitlerRef, (doc) => {
        if (doc.exists()) {
          this.badWordsFilterArray = doc.data().badWords;
          this.badWordsFilterToggle = doc.data().toggle;

          if (this.badWordsFilterToggle === true) {
            document.getElementById("trueBadWordsToggle").checked = true;
          } else {
            document.getElementById("falseBadWordsToggle").checked = true;
          }
        }
      });

      onSnapshot(createSettingsAccessRef, (doc) => {
        if (doc.exists()) {
          if (doc.data().helperTicket === true) {
            document.getElementById("trueHelperInTicket").checked = true;
          } else {
            document.getElementById("falseHelperInTicket").checked = true;
          }
          if (doc.data().moderatorBan === true) {
            document.getElementById("trueModUseBan").checked = true;
          } else {
            document.getElementById("falseModUseBan").checked = true;
          }
        }
      });

      onSnapshot(createSettingsCatagoriesRef, (doc) => {
        if (doc.exists()) {
          this.ticketCategory = doc.data().ticketId;
        }
      });

      onSnapshot(createSettingsChannelsRef, (doc) => {
        if (doc.exists()) {
          this.logsChannel = doc.data().logsId;
        }
      });

      onSnapshot(createSettingsRolesRef, (doc) => {
        if (doc.exists()) {
          this.modRole = doc.data().moderatorRoleId;
          this.adminRole = doc.data().adminRoleId;
          this.staffRole = doc.data().staffRoleId;
          this.helperRole = doc.data().helperRoleId;
          this.mutedRole = doc.data().mutedRoleId;
        }
      });

      onSnapshot(createfeaturesEnabledSettingsRef, (doc) => {
        if (doc.exists()) {
          if (doc.data().logs === true) {
            document.getElementById("trueLogsToggle").checked = true;
          } else {
            document.getElementById("falseLogsToggle").checked = true;
          }
          if (doc.data().moderation === true) {
            document.getElementById("trueModCommandsToggle").checked = true;
          } else {
            document.getElementById("falseModCommandsToggle").checked = true;
          }
          if (doc.data().automod === true) {
            document.getElementById("trueAutoModToggle").checked = true;
          } else {
            document.getElementById("falseAutoModToggle").checked = true;
          }
          if (doc.data().tickets === true) {
            document.getElementById("trueTicketToggle").checked = true;
          } else {
            document.getElementById("falseTicketToggle").checked = true;
          }
        }
      });
    },
    async authorize() {
      const auth = getAuth();
      const docRef = doc(this.db, "Guilds", this.serverId, "settings", "roles");
      const docSnap = await getDoc(docRef);

      const UsersRef = doc(this.db, "Users", auth.currentUser.uid);
      await getDoc(UsersRef).then(doc => {
        this.access_token = doc.data().accessToken;
      });

      await fetch(`https://discord.com/api/users/@me/guilds/${this.serverId}/member`, {
        headers: {
          authorization: `Bearer ${this.access_token}`,
        },
      }).then(result => result.json())
          .then(async response => {
            if (response.message === "You are being rate limited.") {
              this.authorized = false;
              return this.fetchFailed = true;
            }
            this.authorized = response.roles.includes(docSnap.data().adminRoleId);
          })
          .catch(console.error);
      await fetch(`https://discord.com/api/users/@me/guilds`, {
        headers: {
          authorization: `Bearer ${this.access_token}`,
        },
      }).then(result => result.json())
          .then(async response => {
            let obj = response.find(o => o.id === this.serverId);

            if (obj.owner === true) {
              this.authorized = true;
            }
          })
          .catch(console.error);
    },
    async saveRoleSettings() {
      const adminRoleInput = document.getElementById("adminRoleInput").value;
      const moderatorRoleInput = document.getElementById("moderatorRoleInput").value;
      const staffRoleInput = document.getElementById("staffRoleInput").value;
      const helperRoleInput = document.getElementById("helperRoleInput").value;
      const mutedRoleInput = document.getElementById("mutedRoleInput").value;

      const createSettingsRolesRef = doc(this.db, "Guilds", this.serverId, "settings", "roles");
      await updateDoc(createSettingsRolesRef, {
        adminRoleId: ((adminRoleInput === "") ? this.adminRole : adminRoleInput),
        moderatorRoleId: ((moderatorRoleInput === "") ? this.modRole : moderatorRoleInput),
        staffRoleId: ((staffRoleInput === "") ? this.staffRole : staffRoleInput),
        helperRoleId: ((helperRoleInput === "") ? this.helperRole : helperRoleInput),
        mutedRoleId: ((mutedRoleInput === "") ? this.mutedRole : mutedRoleInput),
      });
      alert("Role settings saved!")
      this.$router.go()
    },
    async saveChannelSettings() {
      const logsChannelInput = document.getElementById("logsChannelInput").value;

      const createSettingsChannelsRef = doc(this.db, "Guilds", this.serverId, "settings", "channels");
      await updateDoc(createSettingsChannelsRef, {
        logsId: ((logsChannelInput === "") ? this.logsChannel : logsChannelInput),
      });
      alert("Channel settings saved!")
      this.$router.go()
    },
    async saveAccessSettings() {
      let helperTicketInput = document.querySelector('input[name="helperTicketPerms"]:checked').value;
      let moderatorBanInput = document.querySelector('input[name="moderatorBanAccess"]:checked').value;

      helperTicketInput = (helperTicketInput === "true")
      moderatorBanInput = (moderatorBanInput === "true")

      const createSettingsAccessRef = doc(this.db, "Guilds", this.serverId, "settings", "access");
      await updateDoc(createSettingsAccessRef, {
        helperTicket: helperTicketInput,
        moderatorBan: moderatorBanInput
      });
      alert("Access settings saved!")
      this.$router.go()
    },
    async saveCategorySettings() {
      const ticketCategoryInput = document.getElementById("ticketCategoryInput").value;

      const createSettingsCategoriesRef = doc(this.db, "Guilds", this.serverId, "settings", "catagories");
      await updateDoc(createSettingsCategoriesRef, {
        ticketId: ((ticketCategoryInput === "") ? this.ticketCategory : ticketCategoryInput),
      });
      alert("Category settings saved!")
      this.$router.go()
    },
    async saveFeaturesToggleSettings() {
      let logsToggle = document.querySelector('input[name="logsToggle"]:checked').value;
      let modCommandsToggle = document.querySelector('input[name="modCommandsToggle"]:checked').value;
      let autoModToggle = document.querySelector('input[name="autoModToggle"]:checked').value;
      let ticketToggle = document.querySelector('input[name="ticketToggle"]:checked').value;

      logsToggle = (logsToggle === "true")
      modCommandsToggle = (modCommandsToggle === "true")
      autoModToggle = (autoModToggle === "true")
      ticketToggle = (ticketToggle === "true")

      const createSettingsFeaturesToggleRef = doc(this.db, "Guilds", this.serverId, "settings", "featuresEnabled");
      await updateDoc(createSettingsFeaturesToggleRef, {
        logs: logsToggle,
        moderation: modCommandsToggle,
        automod: autoModToggle,
        tickets: ticketToggle,
      });
      alert("Features toggle settings saved!")
      this.$router.go()
    },
    async deleteBadWord(word) {
      const deleteWordFromListRef = doc(this.db, "Guilds", this.serverId, "settings", "badWordsFilter");
      await updateDoc(deleteWordFromListRef, {
        badWords: arrayRemove(word)
      });
    },
    async addBadWord() {
      const badWordInput = this.wordToAddToFilter;
      const addWordToListRef = doc(this.db, "Guilds", this.serverId, "settings", "badWordsFilter");
      await updateDoc(addWordToListRef, {
        badWords: arrayUnion(badWordInput)
      });
    }
  },

  async created() {
    this.access_token = this.$route.query.access_token;
    this.serverId = this.$route.query.id;
    await this.authorize();
    await this.fetchSettings();
    this.loading = false;
  }
}
</script>

<style scoped>
</style>

