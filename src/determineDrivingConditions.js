export default function determineDrivingConditions(temp) {
  return temp < 20 ? 'poor' : 'good';
}
