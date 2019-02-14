const rangener = nodeRequire('../rangener')

$(() => {
    $("#addButton").click(() => {
        $("#addform").show()
        setRandomVal('#account')
        setRandomVal('#password')
    })

    $(document).on('click', '.flipper', function (e) {
        $(this).toggleClass('flip')
    })

    // 密码可见
    $(document).on('mousedown', '.vis-butt', function(e) {
        e.stopPropagation()
        $(this).parent().prev().prev().css('-webkit-text-security', 'none')
    }).on('mouseup', '.vis-butt', function(e) {
        $(this).parent().prev().prev().css('-webkit-text-security', 'disc')
    }).on('click', '.vis-butt', function(e) {
        e.stopPropagation()
    })

    $(document).on('click', '.copy-butt', function (e) {
        e.stopPropagation()
        var text = $(this).parent().prev().html()
        clipboard.writeText(text)
        tip('copy succ')
    })

    delbuttfun = () => {
        let i = 0
        return () => {
            if ($(".del-butt:visible").length) {
                $(".del-butt").hide()
            } else {
                $(".del-butt").show()
            }
        }
    }
    $("#deleteButton").click(delbuttfun())

    $(document).on('click', '.del-butt', function (e) {
        let flag = confirm('are you sure to delete ' + $(this).data('source'))
        if (flag) {
            ipcRenderer.send('record:del', $(this).data('id'))
        }
    })

    $("#accountfrom").submit((e) => {
        e.preventDefault();
        var data = {}
        data.source = $('#source').val()
        data.account = $('#account').val()
        data.password = $('#password').val()
        data.remark = $('#remark').val()
        ipcRenderer.send('account:add', data)
        hideAddForm()
    })

    $("#form-close-butt").click(e => {
        hideAddForm()
    })

    initRandomCtl('#account')
    initRandomCtl('#password')

})

function setRandomVal(inputId) {
    $(inputId).attr('placeholder', '')
    $(inputId).next('label').addClass('active')
    $(inputId).val(rangener.generate($(inputId + '-butt').val()))
}

function initRandomCtl(inputId) {
    $(inputId + "-butt").mousedown(() => {
        $(this).mousemove(() => {
            setRandomVal(inputId)
        })
    }).mouseup(() => {
        $(this).unbind('mousemove')
    }).click(() => {
        setRandomVal(inputId)
    })
}

function hideAddForm() {
    $('#account-butt').val(20)
    $('#password-butt').val(50)
    $("#addform").hide()
}

function appendAccountCard(record) {
    if (!record.data.remark) {
        record.data.remark = '...'
    } else {
        // limit number of line 
        let lines = record.data.remark.split('\n')
        let biglines = 0
        for (let line of lines) {
            // 一行最多26个字母
            if (line.dbLength() > 26) {
                biglines++
            }
        }
        if (biglines + lines.length > 4) {
            record.data.remark = record.data.remark.split('\n').join('&nbsp&nbsp&nbsp&nbsp')
        }
    }
    let account_fontsize = get_card_font_ra(record.data.account, 16)
    let password_fontsize = get_card_font_ra(record.data.password, 16)
    let title_fontsize = get_card_font_ra(record.data.source, 20) * 1.5
    $('.cube-row').append(`<div id='${record._id}' class="cube-card">
            <div class="flipper">
                <div class="card-front card blue darken-3">
                    <div class="card-title cube-card-title">${record.data.source}</div>
                    <div class="cube-card-remark">${record.data.remark}</div>
                </div>
                <div class="card-back card deep-purple">
                    <div class="card-title cube-card-title" style="font-size: ${title_fontsize}rem">${record.data.source}</div>
                    <div class='cube-card-account'>
                    <table>
                    <colgroup>
                    <col width="10%">
                    <col width="70%">
                    <col width="10%">
                    <col width="10%">
                    </colgroup>
                      <tr>
                        <td><i class="material-icons">account_circle</i></td>
                        <td style="font-size: ${account_fontsize}rem" width="80%">${record.data.account}</td>
                        <td><i class="material-icons copy-butt">content_copy</i></td>
                      </tr>
                      <tr>
                        <td><i class="material-icons">local_parking</i></td>
                        <td style="font-size: ${password_fontsize}rem; -webkit-text-security: disc;">${record.data.password}</td>
                        <td><i class="material-icons copy-butt">content_copy</i></td>
                        <td><i class="material-icons vis-butt">visibility</i></td>
                      </tr>
                  </table>
                        
                    </div>
                </div>
                </div>
            <button data-id='${record._id}' data-source='${record.data.source}' class="btn-floating del-butt" type="button" name="action" style="display: none">
                <i class="material-icons">close</i>
            </button>
        </div>`)
}

// 粗略获取字体比例 避免内容超出, linesize是该行能放得下几个原字符
function get_card_font_ra (text, linesize) {
    let ra = 1
    if (text.dbLength() > linesize) {
        ra = linesize / text.dbLength()
    }
    if (ra < 0.5) {
        ra = 0.5 // 避免太小
    }
    return ra
}

function refreshPagePlugin (currpage, maxpage) {
    let pageHtml = ''
    let classname = 'waves-effect'
    if (currpage == 1) {
        classname = 'disabled'
    }
    // 最多显示5页按钮
    let maxdisplayPage = currpage + 2
    let mindisplayPage = currpage - 2
    if (maxdisplayPage < 5) {
        maxdisplayPage = 5
    }
    if (maxdisplayPage > maxpage) {
        maxdisplayPage = maxpage
    }
    if (mindisplayPage > maxdisplayPage - 4) {
        mindisplayPage = maxdisplayPage - 4
    }
    if (mindisplayPage < 1) {
        mindisplayPage = 1
    }
    pageHtml += `<li class="${classname}"><a href="javascript:void(0);" onclick='loadpage(${currpage - 1})'><i class="material-icons">chevron_left</i></a></li>`
    for (let i = mindisplayPage, index = 1; i <= maxdisplayPage; i++,index++) {
        classname = 'waves-effect'
        if (i == currpage) {
            classname = 'active'
        }
        pageHtml += `<li class="${classname}"><a href="javascript:void(0);" onclick='loadpage(${i})'>${i}</a></li>`
    }
    classname = 'waves-effect'
    if (currpage == maxpage) {
        classname = 'disabled'
    }
    pageHtml += `<li class="${classname}"><a href="javascript:void(0);"><i class="material-icons" onclick='loadpage(${currpage + 1}, ${maxpage})'>chevron_right</i></a></li>`
    $('.pagination').html(pageHtml)
}

function loadpage(page, max) {
    console.log('now will load ' + page)
    if (page <= 0) return
    if (max && page > max) return
    ipcRenderer.send('loadpage', page)
}

ipcRenderer.on('accounts', (event, accounts, page) => {
    $('.cube-row').empty()
    for (let acc of accounts) {
        appendAccountCard(acc)
    }
    console.log(page)
    refreshPagePlugin(page.currpage, page.maxpage)
})

ipcRenderer.on('record:del_succ', (e, id) => {
    console.log('del succ ' + id)
    $('#' + id).fadeOut(800, () => {
        loadpage($('.pagination .active a').html())
    })
})