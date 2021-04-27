<?php

namespace Dizatech\ModuleMenu\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ['title', 'css_class', 'status'];

    public function menu_groups() {
        return $this->belongsToMany(MenuGroup::class, 'menu_menu_group', 'menu_group_id', 'menu_id');
    }

    public function menu_items()
    {
        return $this->hasMany(MenuItem::class);
    }
}
