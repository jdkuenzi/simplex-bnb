/************************************************************************************
 * Projet    : Simplexe - TP de mathématiques
 * Auteurs   : Ottavio Buonomo - Cristiano Pereira Mendes - Jean-Daniel Küenzi
 * Version   : 1.0
 * Date      : 17.01.2020
 ***********************************************************************************/

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    
    data: {
      labels: [v2 + " variables - 15 contr.", vt + " variables - 15 contr.", ""],
      datasets: [{
          label: 'millisecondes',
          data: [temps_2, temps_avec_total_valeurs, 0],
          backgroundColor: [
              'green',
              'green'
          ],
          borderColor: [
              'green',
              'green'
          ],
          borderWidth: 1
      }]
  },

    options: {
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Temps (ms)'
            }
          }],
        }
      }
});


var ctx2 = document.getElementById('myChart2').getContext('2d');
var myChart2 = new Chart(ctx2, {
    type: 'bar',
    
    data: {
      labels: [c1 + " contraintes - 20 vars.", ct + " contraintes - 20 vars.", ""],
      datasets: [{
          label: 'millisecondes',
          data: [temps_1, temps_avec_total_valeurs, 0],
          backgroundColor: [
              'red',
              'red'
          ],
          borderColor: [
              'red',
              'red'
          ],
          borderWidth: 1
      }]
  },

    options: {
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Temps (ms)'
            }
          }],
        }
      }
});

var ctx3 = document.getElementById('myChart3').getContext('2d');
var myChart3 = new Chart(ctx3, {
    type: 'bar',
    
    data: {
      labels: [c1 + " contraintes - 20 vars.", v2 + " variables - 15 contr.", ct + " contraintes - 20 vars.", ""],
      datasets: [{
          label: 'itérations',
          data: [iterContr, iterVars, iterProbFinal,0],
          backgroundColor: [
              'blue',
              'blue',
              'blue'
          ],
          borderColor: [
              'blue',
              'blue',
              'blue'
          ],
          borderWidth: 1
      }]
  },

    options: {
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Itérations'
            }
          }],
        }
      }
});