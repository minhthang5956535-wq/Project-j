<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure a host user exists
        \App\Models\User::firstOrCreate(
            ['email' => 'host@example.com'],
            ['name' => 'Default Host', 'password' => \Illuminate\Support\Facades\Hash::make('password')]
        );

        $hostId = \App\Models\User::first()->id;

        // 2. Create sample properties
        $properties = [
            [
                'host_id' => $hostId,
                'title' => 'Eco-Lodge Giữa Rừng Thông',
                'description' => 'Một không gian yên bình tuyệt đối giữa rừng thông Đà Lạt.',
                'price_per_night' => 1200000,
                'address' => 'Đà Lạt, Lâm Đồng',
                'category' => 'Đồi núi',
                'status' => 'active',
                'image' => 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'host_id' => $hostId,
                'title' => 'Penthouse View Biển Mỹ Khê',
                'description' => 'Căn hộ sang trọng với tầm nhìn trọn vẹn bãi biển đẹp nhất Đà Nẵng.',
                'price_per_night' => 3500000,
                'address' => 'Đà Nẵng',
                'category' => 'Biển',
                'status' => 'active',
                'image' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'host_id' => $hostId,
                'title' => 'Căn Hộ Studio Phố Cổ',
                'description' => 'Ngay trung tâm phố cổ, thuận tiện đi lại và khám phá ẩm thực.',
                'price_per_night' => 850000,
                'address' => 'Hoàn Kiếm, Hà Nội',
                'category' => 'Căn hộ',
                'status' => 'active',
                'image' => 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'host_id' => $hostId,
                'title' => 'Villa Hồ Tây Blue',
                'description' => 'Không gian rộng rãi, hiện đại bên bờ Hồ Tây thơ mộng.',
                'price_per_night' => 4200000,
                'address' => 'Tây Hồ, Hà Nội',
                'category' => 'Hồ bơi',
                'status' => 'active',
                'image' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
            ]
        ];

        foreach ($properties as $propData) {
            $imageUrl = $propData['image'];
            unset($propData['image']);

            $property = \App\Models\Property::create($propData);

            // Create primary image
            \App\Models\PropertyImage::create([
                'property_id' => $property->id,
                'image_url' => $imageUrl,
                'is_primary' => true
            ]);
        }
    }
}
