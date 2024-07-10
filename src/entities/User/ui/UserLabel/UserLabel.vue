<script setup lang="ts">
import { PropType } from 'vue';
import { Row, Card, Avatar, Typography } from '@/shared/ui';
import { __BASE_URL__ } from '@/shared/config/environment'
import { User } from '../../model/types/user';

defineProps({
    user: {
        type: Object as PropType<User>
    },
    showName: {
        type: Boolean,
    }
})
</script>

<<template>
    <Row :gap="'16'" class="pointer">
        <Avatar :src="__BASE_URL__ + user?.avatar" />
        <template v-if="showName">
            <Typography :size="'lg'">{{ user?.displayName }}</Typography>
        </template>
    </Row>
</template>


