<template>
  <div class="container mx-auto p-4">
    <div v-for="(route, index) in routes" :key="index" class="my-4 grid md:grid-cols-4 gap-2 items-center">
      <input
        :list="'stations-start-' + index"
        v-model="route.start"
        @input="callApi('start', index)"
        placeholder="起點"
        class="border p-2 col-span-1"
      />
      <datalist :id="'stations-start-' + index">
        <option v-for="station in route.startSuggestions" :value="station.StationName" :key="station.StationSID + '-start'"></option>
      </datalist>

      <input
        :list="'stations-end-' + index"
        v-model="route.end"
        @input="callApi('end', index)"
        placeholder="目的地"
        class="border p-2 col-span-1"
      />
      <datalist :id="'stations-end-' + index">
        <option v-for="station in route.endSuggestions" :value="station.StationName" :key="station.StationSID + '-end'"></option>
      </datalist>

      <input type="number" v-model="route.trips" placeholder="輸入趟數" class="border p-2 col-span-1">

      <div class="flex">
        <label class="border p-2 bg-gray-200 col-span-1">往返 <input type="checkbox" v-model="route.isRoundTrip" class="align-middle mr-2" /></label>
        <button @click="removeRoute(index)" class="border p-2 bg-red-500 text-white col-span-1">移除</button>
      </div>
    </div>

    <div class="flex justify-center mt-6">
      <button @click="addRoute" class="border p-2 bg-blue-500 text-white mr-4">增加</button>
      <button @click="calculateFare" class="border p-2 bg-green-500 text-white mr-4">計算</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        { start: '', end: '', isRoundTrip: false, trips: 1, startSuggestions: [], endSuggestions: [] }
      ]
    };
  },
  methods: {
    addRoute() {
      this.routes.push({ start: '', end: '', isRoundTrip: false, trips: 1, startSuggestions: [], endSuggestions: [] });
    },
    removeRoute(index) {
      this.routes.splice(index, 1);
    },
    calculate() {
      // Your API call for calculation
      console.log(this.routes);
    },
    async calculateFare() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/calculatefare`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.routes.map(route => ({
            startStationName: route.start,
            endStationName: route.end,
            isRoundTrip: route.isRoundTrip,
            trips: route.trips
          })))
        });

        const data = await response.json();

        if (response.ok && data.totalFare !== undefined) {
          let message;
          if (data.totalFare >= 1200) {
              message = `總金額為 ${data.totalFare}。值得使用TPASS！`;
          } else {
              message = `總金額為 ${data.totalFare}。請再多搭幾趟，才划算喔！`;
          }
          alert(message);
        } else {
          alert('資料有誤');
        }

      } catch (error) {
        console.error("API error:", error);
        alert('資料有誤');
      }
    },
    async callApi(type, index) {
      const inputValue = this.routes[index][type];

      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/searchstations?query=${inputValue}`);
        const data = await response.json();

        // 更新建議
        this.routes[index][`${type}Suggestions`] = data;
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }
  }
};
</script>

<style>
/* Your CSS (TailwindCSS) styles go here */
</style>
