<script>
import { Pie } from 'vue-chartjs';

export default Pie.extend({
  name: 'piechart',
  props: ['options', 'votes'],
  /* Should be more DRY. TODO */
  watch: {
    options: {
      handler: function() {
        this._chart.destroy();
        this.renderPieChart();
      },
      deep: false
    },
    votes: {
      handler: function() {
        this._chart.destroy();
        this.renderPieChart();
      },
      deep: false
    }
  },
  mounted() {
    this.renderPieChart();
  },
  methods: {
    renderPieChart() {
      this.renderChart({
        labels: this.options,
        datasets: [
          {
            data: this.votes,
            backgroundColor: [
              '#898cff', '#ff89b5', '#ffdc89',
              '#90d4f7', '#71e096', '#f5a26f',
              '#668de5', '#ed6d79', '#5ad0e5',
              '#da97e0', '#cff381', '#ff96e3'
            ]
          }
        ]
      }, {responsive: true, maintainAspectRatio: false});
    }
  }
});
</script>