import { BModal } from "bootstrap-vue";

export default function () {
  interface Vue {
    $bvModal: BModal; // bootstrap modal을 위한 전역 타입추가
  }
}
