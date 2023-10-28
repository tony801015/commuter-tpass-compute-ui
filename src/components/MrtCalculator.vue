<template>
  <div class="container mx-auto p-4">
    <div v-for="(route, index) in routes" :key="index" class="my-4 grid grid-cols-5 gap-4 items-center">
      <input
        :list="'stations-start-' + index"
        v-model="route.start"
        @input="callApi('start', index)"
        placeholder="起點"
        class="border p-2 col-span-2"
      />
      <datalist :id="'stations-start-' + index">
        <option v-for="station in route.startSuggestions" :value="station.StationName" :key="station.StationSID + '-start'"></option>
      </datalist>

      <input
        :list="'stations-end-' + index"
        v-model="route.end"
        @input="callApi('end', index)"
        placeholder="目的地"
        class="border p-2 col-span-2"
      />
      <datalist :id="'stations-end-' + index">
        <option v-for="station in route.endSuggestions" :value="station.StationName" :key="station.StationSID + '-end'"></option>
      </datalist>

      <div class="flex">
        <input type="checkbox" v-model="route.isRoundTrip" class="mr-2" />
        <label class="border p-2 bg-gray-200 px-2 ">往返</label>
        <button @click="removeRoute(index)" class="border p-2 bg-red-500 text-white">移除</button>
      </div>
    </div>

    <div class="flex justify-center mt-6">
      <button @click="addRoute" class="border p-2 bg-blue-500 text-white mr-4">+ 增加</button>
      <button @click="calculateFare" class="border p-2 bg-green-500 text-white mr-4">計算</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        { start: '', end: '', isRoundTrip: false, startSuggestions: [], endSuggestions: [] }
      ]
    };
  },
  methods: {
    addRoute() {
      this.routes.push({ start: '', end: '', isRoundTrip: false, startSuggestions: [], endSuggestions: [] });
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
        const response = await fetch('http://localhost:8080/calculatefare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.routes.map(route => ({
            startStationName: route.start,
            endStationName: route.end,
            isRoundTrip: route.isRoundTrip
          })))
        });

        const data = await response.json();

        if (response.ok && data.totalFare !== undefined) {
          alert(`總金額為 ${data.totalFare}`);
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
        const response = await fetch(`http://localhost:8080/searchstations?query=${inputValue}`);
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
