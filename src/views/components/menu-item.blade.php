@foreach( app('Module')->get_enabled_modules() as $module )
    @foreach( $module['admin_links'] as $admin_link )
        @php
            $permission_names = '';
            if(!empty($admin_link['permissions'])){
                $i = 0;
                $size = count($admin_link['permissions']);
                foreach($admin_link['permissions'] as $permission){
                    $i++;
                    if ($i < $size){
                        $or_separator = '|';
                    }else{
                        $or_separator = '';
                    }
                    $permission_names .= $permission->name;
                    $permission_names .= $or_separator;
                }
            }
        @endphp
        @if(Auth()->user()->isAbleTo($permission_names))
            @if( !isset( $admin_link['children'] ) || count( $admin_link['children'] ) == 0 )
                <li class="@php
                    if( isset( $admin_link['classes'] ) && !empty( $admin_link['classes'] ) ){
                        echo implode( " ", $admin_link['classes'] );
                    }
                @endphp">
                    <a class="app-menu__item {{ isActive( $admin_link['route'] ) }}" href="{{ route( $admin_link['route'] ) }}">
                        <i class="app-menu__icon {{ $admin_link['icon'] }}"></i>
                        <span class="app-menu__label">{{ $admin_link['title'] }}</span>
                    </a>
                </li>
            @else
                <li class="treeview @php
                    if( isset( $admin_link['classes'] ) && !empty( $admin_link['classes'] ) ){
                        echo implode( " ", $admin_link['classes'] );
                    }
                @endphp {{ isActive( $module['route_names'], 'is-expanded' ) }}">
                    <a class="app-menu__item" href="#" data-toggle="treeview">
                        <i class="app-menu__icon {{ $admin_link['icon'] }}"></i>
                        <span class="app-menu__label">{{ $admin_link['title'] }}</span>
                        <i class="treeview-indicator fa fa-angle-left"></i>
                    </a>
                    <ul class="treeview-menu">
                        @foreach( $admin_link['children'] as $child )
                            @php
                                $permission_names = '';
                                if(!empty($child['permissions'])){
                                    $i = 0;
                                    $size = count($child['permissions']);
                                    foreach($child['permissions'] as $permission){
                                        $i++;
                                        if ($i < $size){
                                            $or_separator = '|';
                                        }else{
                                            $or_separator = '';
                                        }
                                        $permission_names .= $permission->name;
                                        $permission_names .= $or_separator;
                                    }
                                }
                            @endphp
                            @if(Auth()->user()->isAbleTo($permission_names))
                                @if( !isset( $child['visible'] ) || $child['visible'] !== false )
                                    <li class="@php
                                        if( isset( $child['classes'] ) && !empty( $child['classes'] ) ){
                                            echo implode( " ", $child['classes'] );
                                        }
                                    @endphp">
                                        <a class="treeview-item pl-3 {{ isActive( $child['route'] ) }}" href="{{ route( $child['route'] ) }}">
                                            <i class="icon fa fa-circle-o"></i>{{ $child['title'] }}
                                        </a>
                                    </li>
                                @endif
                            @endif
                        @endforeach
                    </ul>
                </li>
            @endif
        @endif
    @endforeach
@endforeach
@if(auth()->user()->is_admin && auth()->user()->hasRole(['programmer']))
    <li class="treeview {{ isActive( ['menu.index'], 'is-expanded' ) }}">
        <a class="app-menu__item" href="#" data-toggle="treeview">
            <i class="app-menu__icon fa fa-bars"></i>
            <span class="app-menu__label">منوها</span>
            <i class="treeview-indicator fa fa-angle-left"></i>
        </a>
        <ul class="treeview-menu">
            <li><a class="treeview-item pl-3 {{ isActive('menu.index') }}" href="{{ route('menu.index') }}"><i class="icon fa fa-circle-o"></i>منو ادمین</a></li>
        </ul>
    </li>
@endif