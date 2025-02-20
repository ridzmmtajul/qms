<?php

namespace Database\Seeders;
 
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = new User();
        $user->username = 'jerico.tan@dict.gov.ph';
        $user->first_name = 'Jec';
        $user->last_name = 'Tan';
        $user->password = Hash::make('jec');
        $user->save();
        $user->roles()->sync([1]);
    }
}
